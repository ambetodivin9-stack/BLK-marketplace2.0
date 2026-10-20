// ============================================================================
// BLK Marketplace - Relances, nouveautés et notifications de commandes
// Fichier à placer à la racine du projet, à côté de server.js.
// ============================================================================
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = function setupEngagement(app, ctx) {
  const getDb = ctx.getDb;
  const isReady = ctx.isReady;
  const push = ctx.push;

  const CRON_SECRET = process.env.CRON_SECRET || '';
  const DAY = 24 * 60 * 60 * 1000;
  const ARTICLES_THRESHOLD = 30;            // nombre de nouveaux articles avant d'avertir tout le monde
  const BROADCAST_MIN_GAP = 3 * 60 * 60 * 1000; // au moins 3 h entre deux annonces de nouveautés

  function toMs(v) {
    if (!v) return 0;
    if (typeof v.toDate === 'function') return v.toDate().getTime();
    const t = new Date(v).getTime();
    return isNaN(t) ? 0 : t;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function firstName(u) {
    const n = String((u && u.name) || '').trim().split(' ')[0];
    if (!n || /^(compte|membre|utilisateur|administrateur)$/i.test(n)) return '';
    return n;
  }

  // ---------------------------------------------------------------------------
  // 1) Dernière visite : mise à jour au plus une fois toutes les 10 minutes par utilisateur
  // ---------------------------------------------------------------------------
  const seen = new Map();
  app.use((req, res, next) => {
    try {
      const h = req.headers.authorization;
      if (h && h.startsWith('Bearer ') && isReady()) {
        const dec = jwt.verify(h.slice(7), process.env.JWT_SECRET);
        const uid = dec && dec.userId;
        if (uid && Date.now() - (seen.get(uid) || 0) > 10 * 60 * 1000) {
          seen.set(uid, Date.now());
          getDb().collection('users').doc(uid)
            .update({ lastSeenAt: new Date(), reminderStage: 0 })
            .catch(() => {});
        }
      }
    } catch (e) { /* jeton invalide : on ignore */ }
    next();
  });

  // ---------------------------------------------------------------------------
  // 2) Nouveautés : tous les 30 nouveaux articles, on prévient tout le monde
  // ---------------------------------------------------------------------------
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/api/articles') {
      res.on('finish', () => {
        if (res.statusCode === 200) onArticlePublished().catch(e => console.error('[engagement] compteur articles:', e.message));
      });
    }
    next();
  });

  async function allSubscribedUserIds() {
    const snap = await getDb().collection('pushSubscriptions').limit(5000).get();
    return [...new Set(snap.docs.map(d => d.data().userId).filter(Boolean))];
  }

  async function onArticlePublished() {
    if (!isReady()) return;
    const db = getDb();
    const ref = db.collection('config').doc('engagement');
    const shouldBroadcast = await db.runTransaction(async (t) => {
      const s = await t.get(ref);
      const d = s.exists ? s.data() : {};
      const n = (d.newArticles || 0) + 1;
      const gapOk = Date.now() - toMs(d.lastBroadcastAt) > BROADCAST_MIN_GAP;
      if (n >= ARTICLES_THRESHOLD && gapOk) {
        t.set(ref, { newArticles: 0, lastBroadcastAt: new Date() }, { merge: true });
        return true;
      }
      t.set(ref, { newArticles: n }, { merge: true });
      return false;
    });
    if (shouldBroadcast) await broadcastNewArticles();
  }

  async function broadcastNewArticles() {
    const ids = await allSubscribedUserIds();
    const payload = {
      title: '🆕 Nouveautés sur BLK !',
      body: pick([
        `${ARTICLES_THRESHOLD} nouveaux articles viennent d'arriver 😍 Viens les découvrir avant qu'ils partent 🔥`,
        `Des dizaines de nouveautés t'attendent 🛍️✨ Fais un tour sur BLK !`
      ]),
      tag: 'blk-news',
      noBadge: true
    };
    for (let i = 0; i < ids.length; i += 10) {
      await Promise.all(ids.slice(i, i + 10).map(id => push(id, payload).catch(() => {})));
    }
    console.log('[engagement] nouveautés envoyées à', ids.length, 'utilisateurs');
  }

  // ---------------------------------------------------------------------------
  // 3) Relances après 3 jours puis 7 jours d'absence
  // ---------------------------------------------------------------------------
  function reminderPayload(stage, name) {
    const hi = name ? `${name}, ` : '';
    if (stage === 1) {
      return pick([
        { title: "🛍️ C'est l'heure du shopping !", body: `${hi}ça fait quelques jours qu'on ne t'a pas vu 👀 De nouveaux articles t'attendent sur BLK 😍` },
        { title: '👗 Du nouveau sur BLK !', body: `${hi}viens faire un tour, les vendeurs ont publié plein de nouveautés 🔥` }
      ]);
    }
    return pick([
      { title: '😢 Tu nous manques !', body: `${hi}ça fait une semaine ! Les bonnes affaires partent vite, reviens vite 💛🛍️` },
      { title: "🔥 Les bonnes affaires t'attendent", body: `${hi}passe nous voir sur BLK, il y a sûrement un article fait pour toi 😍✨` }
    ]);
  }

  async function engagementStart() {
    const db = getDb();
    const ref = db.collection('config').doc('engagement');
    const s = await ref.get();
    if (s.exists && s.data().startedAt) return toMs(s.data().startedAt);
    const now = new Date();
    await ref.set({ startedAt: now }, { merge: true });
    return now.getTime();
  }

  async function runReminders() {
    const db = getDb();
    const now = Date.now();
    const started = await engagementStart();
    const ids = await allSubscribedUserIds();
    let stage1 = 0, stage2 = 0;
    for (let i = 0; i < ids.length; i += 100) {
      const refs = ids.slice(i, i + 100).map(id => db.collection('users').doc(id));
      const docs = await db.getAll(...refs);
      for (const doc of docs) {
        if (!doc.exists) continue;
        const u = doc.data();
        if (u.deleted || doc.id === 'admin') continue;
        // Sans visite enregistrée, on compte à partir de l'inscription ou de la mise en service de ce système
        const base = u.lastSeenAt ? toMs(u.lastSeenAt) : Math.max(toMs(u.createdAt), started);
        const idle = now - base;
        const stage = u.reminderStage || 0;
        let send = 0;
        if (idle >= 7 * DAY && stage < 2) send = 2;
        else if (idle >= 3 * DAY && stage < 1) send = 1;
        if (!send) continue;
        const p = reminderPayload(send, firstName(u));
        p.tag = 'blk-reminder';
        p.noBadge = true;
        await push(doc.id, p).catch(() => {});
        await doc.ref.update({ reminderStage: send, lastReminderAt: new Date() }).catch(() => {});
        if (send === 2) stage2++; else stage1++;
      }
    }
    return { checked: ids.length, sent3days: stage1, sent7days: stage2 };
  }

  // Adresse appelée chaque jour par cron-job.org (et pour tester)
  app.get('/api/cron/engagement', async (req, res) => {
    const key = String(req.query.key || '');
    const a = Buffer.from(key), b = Buffer.from(CRON_SECRET);
    if (!CRON_SECRET || a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.sendStatus(403);
    if (!isReady()) return res.status(503).json({ success: false, message: 'Base non disponible' });
    try {
      // Test : ?testEmail=ton@email.com envoie tout de suite une relance d'essai à ce compte
      if (req.query.testEmail) {
        const snap = await getDb().collection('users').where('email', '==', String(req.query.testEmail).trim().toLowerCase()).limit(1).get();
        if (snap.empty) return res.json({ success: false, message: 'Aucun compte avec cet e-mail' });
        const p = reminderPayload(1, firstName(snap.docs[0].data()));
        p.tag = 'blk-test'; p.noBadge = true;
        await push(snap.docs[0].id, p);
        return res.json({ success: true, test: true, message: 'Notification de test envoyée' });
      }
      const r = await runReminders();
      res.json({ success: true, ...r });
    } catch (e) {
      console.error('[engagement] cron:', e.message);
      res.status(500).json({ success: false });
    }
  });

  // ---------------------------------------------------------------------------
  // 4) Notifications pour les commandes, ventes, argent reçu, flammes
  //    (le serveur écrit déjà une "notification" pour chacun de ces événements)
  // ---------------------------------------------------------------------------
  function mapNotification(d) {
    const msg = String(d.message || '');
    switch (d.type) {
      case 'new_order':
        return { title: '🛍️ Nouvelle commande !', body: `${msg} 🎉 Ouvre BLK pour voir les détails.`, tag: 'order-' + (d.orderId || '') };
      case 'sale_confirmed':
        return { title: '💰 Vente confirmée !', body: `${msg} 🎉`, tag: 'sale-' + (d.orderId || '') };
      case 'order_expired':
        return { title: '⏰ Commande expirée', body: `${msg} 💸`, tag: 'exp-' + (d.orderId || '') };
      case 'transfer_received':
        return { title: '💸 Argent reçu !', body: `${msg} 🎉`, tag: 'transfer' };
      case 'flame_received':
        return { title: '🔥 Nouvelle flamme !', body: 'Un acheteur t\'a donné une flamme, bravo ! 🔥👏', tag: 'flame' };
      default:
        return null; // les messages ont déjà leur propre notification
    }
  }

  let cursor = new Date();
  function startNotificationListener() {
    const db = getDb();
    try {
      db.collection('notifications').where('createdAt', '>', cursor).onSnapshot((snap) => {
        snap.docChanges().forEach((ch) => {
          if (ch.type !== 'added') return;
          const d = ch.doc.data();
          const t = new Date(toMs(d.createdAt) || Date.now());
          if (t > cursor) cursor = t;
          const p = mapNotification(d);
          if (p && d.userId) push(d.userId, p).catch(() => {});
        });
      }, (err) => {
        console.error('[engagement] écoute des notifications interrompue, nouvel essai dans 30 s:', err.message);
        setTimeout(startNotificationListener, 30000);
      });
    } catch (e) {
      console.error('[engagement] impossible de démarrer l\'écoute:', e.message);
      setTimeout(startNotificationListener, 30000);
    }
  }

  // ---------------------------------------------------------------------------
  // Démarrage dès que la base est prête
  // ---------------------------------------------------------------------------
  let tries = 0;
  const boot = setInterval(() => {
    tries++;
    if (isReady()) {
      clearInterval(boot);
      startNotificationListener();
      engagementStart().catch(() => {});
      // Si le serveur reste éveillé, il vérifie aussi les relances toutes les 6 heures
      setTimeout(() => { runReminders().catch(e => console.error('[engagement] relances:', e.message)); }, 3 * 60 * 1000);
      setInterval(() => { runReminders().catch(e => console.error('[engagement] relances:', e.message)); }, 6 * 60 * 60 * 1000);
      console.log('Engagement (relances, nouveautés, commandes) prêt');
    } else if (tries > 60) {
      clearInterval(boot);
    }
  }, 2000);
};
