// live.js - Lives BLK : abonnements, salle de live, articles à réserver, réservations (argent bloqué), vidéo Agora
const crypto = require('crypto');

module.exports = function setupLive(app, ctx) {
  const { admin, getDb, isReady, authenticate, requirePin, push, parseAmount, commissionBuyer, commissionSeller,
    orderDelayMs, categories, invalidateCache, rateLimit, AgoraToken } = ctx;
  const db = () => getDb();
  const FV = admin.firestore.FieldValue;

  const LIVE_MAX_MS = 3 * 60 * 60 * 1000;      // un live dure 3 h au maximum
  const HOST_TIMEOUT_MS = 90 * 1000;           // si le vendeur disparaît 90 s, le live se termine
  const MAX_ITEMS = 30;
  const LIVES = new Map();                     // id -> état en mémoire (lecture sans Firestore)

  // ---------------------------------------------------------------- utilitaires
  const ucache = new Map();
  async function userInfo(uid) {
    const c = ucache.get(uid);
    if (c && Date.now() - c.t < 600000) return c;
    const s = await db().collection('users').doc(uid).get();
    const x = s.data() || {};
    const v = { name: x.name || 'Utilisateur', photo: x.photo || '', phone: x.phone || '', city: x.city || '', country: x.country || '', flames: x.flames || 0, t: Date.now() };
    ucache.set(uid, v);
    return v;
  }
  const firstName = (n) => String(n || 'Quelqu\'un').split(' ')[0];
  function uidFor(userId) { return (crypto.createHash('sha256').update(String(userId)).digest().readUInt32BE(0) % 2000000000) + 1; }

  // ---- Jeton Agora « AccessToken2 » de secours (utilisé seulement si le module officiel agora-token n'est pas installé)
  function manualToken(appId, cert, channel, uid, isHost, expire) {
    const zlib = require('zlib');
    const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
    const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };
    const str = (x) => { const b = Buffer.from(String(x)); return Buffer.concat([u16(b.length), b]); };
    const hmac = (k, m) => crypto.createHmac('sha256', k).update(m).digest();
    const issueTs = Math.floor(Date.now() / 1000), salt = Math.floor(Math.random() * 0xFFFFFFFF);
    const privs = isHost ? { 1: expire, 2: expire, 3: expire, 4: expire } : { 1: expire };
    const keys = Object.keys(privs).map(Number).sort((a, b) => a - b);
    const service = Buffer.concat([u16(1), u16(keys.length), ...keys.map(k => Buffer.concat([u16(k), u32(privs[k])])), str(channel), str(uid)]);
    const signing = hmac(u32(salt), hmac(u32(issueTs), cert));
    const info = Buffer.concat([str(appId), u32(issueTs), u32(expire), u32(salt), u16(1), service]);
    const signature = hmac(signing, info);
    return '007' + zlib.deflateSync(Buffer.concat([str(signature), info])).toString('base64');
  }
  function agoraCreds(userId, liveId, isHost) {
    const appId = process.env.AGORA_APP_ID, cert = process.env.AGORA_APP_CERTIFICATE;
    if (!appId || !cert) throw new Error('AGORA_NON_CONFIGURE');
    const exp = 4 * 3600;
    let token;
    if (AgoraToken) {
      const role = isHost ? AgoraToken.RtcRole.PUBLISHER : AgoraToken.RtcRole.SUBSCRIBER;
      token = AgoraToken.RtcTokenBuilder.buildTokenWithUid(appId, cert, liveId, uidFor(userId), role, exp, exp);
    } else {
      token = manualToken(appId, cert, liveId, uidFor(userId), isHost, exp);
    }
    return { appId, token, uid: uidFor(userId), channel: liveId, role: isHost ? 'host' : 'audience' };
  }
  function agoraError(res, e) {
    if (e.message === 'AGORA_NON_CONFIGURE') return res.status(503).json({ success: false, message: "La vidéo en direct n'est pas encore configurée." });
    if (e.message === 'AGORA_MODULE_MANQUANT') return res.status(503).json({ success: false, message: "Module vidéo manquant sur le serveur (agora-token)." });
    console.error('[live] agora:', e.message);
    return res.status(500).json({ success: false, message: 'Erreur vidéo, réessaie.' });
  }
  const publicItem = (it) => ({ id: it.id, name: it.name, price: it.price, category: it.category, status: it.status, reservedBy: it.reservedByName || '' });
  const publicLive = (st) => ({
    id: st.meta.id, sellerId: st.meta.sellerId, sellerName: st.meta.sellerName, sellerPhoto: st.meta.sellerPhoto,
    coverUrl: st.meta.coverUrl || '', city: st.meta.city || '', startedAt: st.meta.startedAt, viewers: countViewers(st),
    itemCount: Array.from(st.items.values()).filter(i => i.status === 'available').length
  });
  function countViewers(st) {
    const now = Date.now();
    for (const [k, t] of st.viewers) if (now - t > 12000) st.viewers.delete(k);
    return st.viewers.size;
  }
  function newState(meta) { return { meta, items: new Map(), comments: [], seq: 0, flames: 0, viewers: new Map(), hostSeen: Date.now(), lastComment: new Map(), flameRate: new Map() }; }
  function addComment(st, c) {
    st.seq += 1; st.comments.push({ seq: st.seq, ...c, at: Date.now() });
    if (st.comments.length > 150) st.comments.splice(0, st.comments.length - 150);
  }

  // ---------------------------------------------------------------- abonnements
  app.get('/api/follow/:sellerId', authenticate, async (req, res) => {
    if (!isReady()) return res.status(500).json({ success: false });
    try {
      const sid = req.params.sellerId;
      const f = await db().collection('follows').doc(`${req.userId}_${sid}`).get();
      const u = await db().collection('users').doc(sid).get();
      res.json({ success: true, following: f.exists, followers: (u.data() && u.data().followersCount) || 0 });
    } catch (e) { res.status(500).json({ success: false }); }
  });
  app.post('/api/follow', authenticate, async (req, res) => {
    if (!isReady()) return res.status(500).json({ success: false });
    try {
      const sid = String(req.body.sellerId || '');
      if (!sid || sid === req.userId) return res.status(400).json({ success: false, message: 'Impossible de te suivre toi-même.' });
      const fref = db().collection('follows').doc(`${req.userId}_${sid}`), uref = db().collection('users').doc(sid);
      const followers = await db().runTransaction(async (t) => {
        const f = await t.get(fref), u = await t.get(uref);
        if (!u.exists) throw new Error('INTROUVABLE');
        const cur = u.data().followersCount || 0;
        if (f.exists) return cur;
        t.set(fref, { followerId: req.userId, sellerId: sid, createdAt: new Date() });
        t.update(uref, { followersCount: cur + 1 });
        return cur + 1;
      });
      res.json({ success: true, following: true, followers });
    } catch (e) { res.status(e.message === 'INTROUVABLE' ? 404 : 500).json({ success: false, message: 'Impossible pour le moment.' }); }
  });
  app.delete('/api/follow/:sellerId', authenticate, async (req, res) => {
    if (!isReady()) return res.status(500).json({ success: false });
    try {
      const sid = req.params.sellerId;
      const fref = db().collection('follows').doc(`${req.userId}_${sid}`), uref = db().collection('users').doc(sid);
      const followers = await db().runTransaction(async (t) => {
        const f = await t.get(fref), u = await t.get(uref);
        const cur = (u.exists && u.data().followersCount) || 0;
        if (!f.exists) return cur;
        t.delete(fref);
        if (u.exists) t.update(uref, { followersCount: Math.max(0, cur - 1) });
        return Math.max(0, cur - 1);
      });
      res.json({ success: true, following: false, followers });
    } catch (e) { res.status(500).json({ success: false }); }
  });

  // ---------------------------------------------------------------- lives
  const liveLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => 'live:' + (req.userId || req.ip), message: { success: false, message: 'Trop de tentatives. Réessaie dans quelques minutes.' } });

  async function notifyFollowers(st) {
    try {
      const snap = await db().collection('follows').where('sellerId', '==', st.meta.sellerId).limit(500).get();
      const ids = snap.docs.map(d => d.data().followerId);
      for (let i = 0; i < ids.length; i += 10) {
        await Promise.all(ids.slice(i, i + 10).map(id => Promise.resolve(push(id, { title: `🔴 ${st.meta.sellerName} est en direct`, body: 'Rejoins le live maintenant !', tag: 'live-' + st.meta.id })).catch(() => {})));
      }
    } catch (e) { console.error('[live] notif abonnés:', e.message); }
  }

  app.get('/api/lives', authenticate, (req, res) => {
    const list = Array.from(LIVES.values()).filter(st => st.meta.status === 'live').map(publicLive).sort((a, b) => b.startedAt - a.startedAt);
    res.json({ success: true, data: list });
  });

  app.post('/api/lives', authenticate, liveLimiter, async (req, res) => {
    if (!isReady()) return res.status(500).json({ success: false, message: 'Service indisponible' });
    try {
      for (const st of LIVES.values()) {
        if (st.meta.sellerId === req.userId && st.meta.status === 'live') {   // reprise de son propre live
          st.hostSeen = Date.now();
          return res.json({ success: true, liveId: st.meta.id, resumed: true, agora: agoraCreds(req.userId, st.meta.id, true) });
        }
      }
      const u = await userInfo(req.userId);
      const ref = db().collection('lives').doc();
      const creds = agoraCreds(req.userId, ref.id, true);   // échoue avant de créer le live si la vidéo n'est pas configurée
      const meta = { id: ref.id, sellerId: req.userId, sellerName: u.name, sellerPhoto: u.photo, city: u.city, country: u.country, coverUrl: '', status: 'live', startedAt: Date.now() };
      await ref.set({ ...meta, startedAt: new Date(meta.startedAt) });
      const st = newState(meta); LIVES.set(ref.id, st);
      addComment(st, { system: true, text: `${firstName(u.name)} a lancé le live` });
      notifyFollowers(st);
      res.json({ success: true, liveId: ref.id, agora: creds });
    } catch (e) { agoraError(res, e); }
  });

  app.post('/api/lives/:id/token', authenticate, async (req, res) => {
    const st = LIVES.get(req.params.id);
    if (!st || st.meta.status !== 'live') return res.status(404).json({ success: false, message: 'Ce live est terminé.' });
    try { res.json({ success: true, agora: agoraCreds(req.userId, st.meta.id, req.userId === st.meta.sellerId) }); } catch (e) { agoraError(res, e); }
  });

  app.post('/api/lives/:id/cover', authenticate, async (req, res) => {
    const st = LIVES.get(req.params.id);
    if (!st || st.meta.sellerId !== req.userId) return res.status(403).json({ success: false });
    const url = String(req.body.url || '');
    if (!/^https:\/\//.test(url)) return res.status(400).json({ success: false });
    st.meta.coverUrl = url.slice(0, 600);
    db().collection('lives').doc(st.meta.id).update({ coverUrl: st.meta.coverUrl }).catch(() => {});
    res.json({ success: true });
  });

  app.get('/api/lives/:id/state', authenticate, async (req, res) => {
    const st = LIVES.get(req.params.id);
    if (!st) {
      try { const d = await db().collection('lives').doc(req.params.id).get(); if (d.exists) return res.json({ success: true, status: 'ended' }); } catch (e) {}
      return res.status(404).json({ success: false, message: 'Live introuvable' });
    }
    const isHost = req.userId === st.meta.sellerId;
    if (isHost) st.hostSeen = Date.now(); else st.viewers.set(req.userId, Date.now());
    const since = parseInt(req.query.since, 10) || 0;
    res.json({
      success: true, status: st.meta.status, viewers: countViewers(st), flames: st.flames,
      host: { id: st.meta.sellerId, name: st.meta.sellerName, photo: st.meta.sellerPhoto },
      items: Array.from(st.items.values()).map(publicItem),
      comments: st.comments.filter(c => c.seq > since), seq: st.seq, isHost
    });
  });

  app.post('/api/lives/:id/comment', authenticate, async (req, res) => {
    const st = LIVES.get(req.params.id);
    if (!st || st.meta.status !== 'live') return res.status(409).json({ success: false, message: 'Live terminé' });
    const text = String(req.body.text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    if (!text) return res.status(400).json({ success: false });
    const last = st.lastComment.get(req.userId) || 0;
    if (Date.now() - last < 1200) return res.status(429).json({ success: false, message: 'Doucement 🙂' });
    st.lastComment.set(req.userId, Date.now());
    try { const u = await userInfo(req.userId); addComment(st, { userId: req.userId, name: u.name, photo: u.photo, text }); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
  });

  app.post('/api/lives/:id/flame', authenticate, (req, res) => {
    const st = LIVES.get(req.params.id);
    if (!st || st.meta.status !== 'live') return res.status(409).json({ success: false });
    const now = Date.now(), r = st.flameRate.get(req.userId) || { t: now, n: 0 };
    if (now - r.t > 60000) { r.t = now; r.n = 0; }
    if (r.n >= 60) return res.json({ success: true, flames: st.flames });
    r.n++; st.flameRate.set(req.userId, r); st.flames++;
    res.json({ success: true, flames: st.flames });
  });

  // Le vendeur ajoute un article à réserver
  app.post('/api/lives/:id/items', authenticate, async (req, res) => {
    if (!isReady()) return res.status(500).json({ success: false });
    const st = LIVES.get(req.params.id);
    if (!st || st.meta.status !== 'live') return res.status(409).json({ success: false, message: 'Live terminé' });
    if (st.meta.sellerId !== req.userId) return res.status(403).json({ success: false, message: 'Seul le vendeur peut ajouter des articles.' });
    try {
      const name = String(req.body.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      let price; try { price = parseAmount(req.body.price); } catch (e) { return res.status(400).json({ success: false, message: 'Prix invalide.' }); }
      const category = categories.includes(req.body.category) ? req.body.category : 'accessoires';
      if (name.length < 2) return res.status(400).json({ success: false, message: "Donne un nom à l'article." });
      if (price < 100 || price > 5000000) return res.status(400).json({ success: false, message: 'Prix invalide.' });
      if (st.items.size >= MAX_ITEMS) return res.status(400).json({ success: false, message: `Maximum ${MAX_ITEMS} articles par live.` });
      const u = await userInfo(req.userId);
      const ref = await db().collection('products').add({
        title: name, price, category, targetGender: 'unisexe', condition: 'neuf', description: 'Article proposé pendant un live', size: '', hashtags: [],
        images: [], image: '', sellerId: req.userId, sellerName: u.name, sellerPhoto: u.photo, sellerFlames: u.flames || 0, stock: 1, status: 'live', isLive: true,
        liveId: st.meta.id, views: 0, favorites: 0, country: u.country, city: u.city, createdAt: new Date()
      });
      st.items.set(ref.id, { id: ref.id, name, price, category, status: 'available' });
      addComment(st, { system: true, text: `Nouvel article : ${name} — ${price} FCFA` });
      res.json({ success: true, item: publicItem(st.items.get(ref.id)) });
    } catch (e) { console.error('[live] ajout article:', e.message); res.status(500).json({ success: false, message: 'Erreur, réessaie.' }); }
  });

  // Un spectateur réserve : argent bloqué, article réservé pour lui seul
  app.post('/api/lives/:id/items/:itemId/reserve', authenticate, async (req, res) => {
    if (!isReady()) return res.status(500).json({ success: false });
    try {
      if (!(await requirePin(req, res))) return;
      const st = LIVES.get(req.params.id);
      if (!st || st.meta.status !== 'live') return res.status(409).json({ success: false, message: 'Ce live est terminé.' });
      const it = st.items.get(req.params.itemId);
      if (!it) return res.status(404).json({ success: false, message: 'Article introuvable.' });
      const buyerId = req.userId, sellerId = st.meta.sellerId;
      if (buyerId === sellerId) return res.status(400).json({ success: false, message: 'Tu ne peux pas réserver ton propre article.' });
      if (it.status !== 'available' || it.locking) return res.status(409).json({ success: false, message: "Cet article vient d'être réservé par quelqu'un d'autre." });
      const quartier = String(req.body.quartier || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      const details = String(req.body.details || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      if (!quartier) return res.status(400).json({ success: false, message: 'Indique ton quartier.' });

      it.locking = true;
      try {
        const buyerDoc = await db().collection('users').doc(buyerId).get();
        const bd = buyerDoc.data() || {};
        if ((bd.blockedUsers || []).includes(sellerId)) return res.status(403).json({ success: false, message: 'Tu as bloqué ce vendeur.' });
        const price = it.price, buyerCommission = Math.round(price * commissionBuyer), totalAmount = price + buyerCommission;
        if ((bd.walletBalance || 0) < totalAmount) return res.status(400).json({ success: false, message: 'Solde insuffisant', required: totalAmount, balance: bd.walletBalance || 0 });
        const prodRef = db().collection('products').doc(it.id), buyerRef = db().collection('users').doc(buyerId);
        await db().runTransaction(async (t) => {
          const fb = await t.get(buyerRef), fp = await t.get(prodRef);
          if (!fp.exists || fp.data().status !== 'live') throw new Error('DEJA_RESERVE');
          const bal = fb.data().walletBalance || 0;
          if (bal < totalAmount) throw new Error('SOLDE');
          t.update(buyerRef, { walletBalance: bal - totalAmount });
          t.update(prodRef, { status: 'reserved', reservedAt: new Date(), reservedBy: buyerId, stock: FV.increment(-1) });
        });
        const order = {
          articleId: it.id, buyerId, sellerId, buyerPhone: bd.phone || '', amount: price, buyerCommission, totalAmount,
          sellerCommission: Math.round(price * commissionSeller), status: 'en attente de confirmation', buyerConfirmed: false, buyerConfirmedAt: null, flamesGiven: false,
          isLive: true, liveId: st.meta.id, quartier, deliveryDetails: details, liveHold: true,
          expiresAt: new Date(Date.now() + LIVE_MAX_MS + orderDelayMs), createdAt: new Date()    // le vrai chrono de 6 h démarre à la fin du live
        };
        const oref = await db().collection('orders').add(order);
        it.status = 'reserved'; it.reservedByName = firstName(bd.name); it.orderId = oref.id; it.buyerId = buyerId;
        addComment(st, { system: true, text: `${firstName(bd.name)} a réservé « ${it.name} »` });
        const seller = await userInfo(sellerId);
        const msgText = `Réservation live : « ${it.name} » — ${price} FCFA. Quartier : ${quartier}${details ? '. Précisions : ' + details : ''}.`;
        await db().collection('messages').add({ senderId: buyerId, receiverId: sellerId, text: msgText, audioUrl: '', audioDuration: 0, senderName: bd.name || 'Acheteur', senderPhoto: bd.photo || '',
          receiverName: seller.name, receiverPhoto: seller.photo, participants: [buyerId, sellerId], read: false, createdAt: new Date() });
        db().collection('notifications').add({ userId: sellerId, message: `Réservation live #${oref.id.slice(0, 8)} - ${price} FCFA`, type: 'new_order', read: false, orderId: oref.id, createdAt: new Date() }).catch(() => {});
        Promise.resolve(push(sellerId, { title: '🛍️ Réservation live', body: `${firstName(bd.name)} a réservé « ${it.name} » — ${quartier}`, tag: 'live-res-' + oref.id })).catch(() => {});
        if (typeof invalidateCache === 'function') invalidateCache();
        res.json({ success: true, orderId: oref.id, totalAmount, message: 'Réservé ! Ton argent est gardé par BLK. Le chrono de 6 h démarre à la fin du live.' });
      } finally { it.locking = false; }
    } catch (e) {
      if (e.message === 'DEJA_RESERVE') return res.status(409).json({ success: false, message: "Cet article vient d'être réservé par quelqu'un d'autre." });
      if (e.message === 'SOLDE') return res.status(400).json({ success: false, message: 'Solde insuffisant' });
      console.error('[live] réservation:', e.message);
      res.status(500).json({ success: false, message: 'Erreur, réessaie.' });
    }
  });

  // ---------------------------------------------------------------- fin du live
  async function endLive(id) {
    const st = LIVES.get(id);
    if (!st || st.meta.status !== 'live') return null;
    st.meta.status = 'ended'; st.meta.endedAt = Date.now();
    const endTs = new Date(st.meta.endedAt);
    let reserved = 0;
    try {
      for (const it of st.items.values()) {   // les articles non réservés sont supprimés
        if (it.status === 'available') await db().collection('products').doc(it.id).delete().catch(() => {});
      }
      const snap = await db().collection('orders').where('liveId', '==', id).get();
      for (const d of snap.docs) {             // le chrono de 6 h démarre maintenant
        if (d.data().status === 'en attente de confirmation') {
          await d.ref.update({ createdAt: endTs, expiresAt: new Date(endTs.getTime() + orderDelayMs), liveHold: false });
          reserved++;
          Promise.resolve(push(d.data().buyerId, { title: 'Live terminé', body: 'Le chrono de 6 h a démarré pour ta réservation. Confirme quand tu reçois ton article.', tag: 'live-end-' + d.id })).catch(() => {});
        }
      }
      await db().collection('lives').doc(id).update({ status: 'ended', endedAt: endTs, reservedCount: reserved });
    } catch (e) { console.error('[live] fin du live:', e.message); }
    Promise.resolve(push(st.meta.sellerId, { title: 'Live terminé', body: `${reserved} réservation(s). Prépare tes articles : livraison sous 6 h.`, tag: 'live-end-seller-' + id })).catch(() => {});
    setTimeout(() => LIVES.delete(id), 3 * 60 * 1000);
    return { reserved };
  }
  app.post('/api/lives/:id/end', authenticate, async (req, res) => {
    const st = LIVES.get(req.params.id);
    if (!st) return res.json({ success: true, reserved: 0 });
    if (st.meta.sellerId !== req.userId) return res.status(403).json({ success: false });
    const r = await endLive(req.params.id);
    res.json({ success: true, reserved: r ? r.reserved : 0 });
  });
  setInterval(() => {
    const now = Date.now();
    for (const st of LIVES.values()) {
      if (st.meta.status !== 'live') continue;
      if (now - st.meta.startedAt > LIVE_MAX_MS || now - st.hostSeen > HOST_TIMEOUT_MS) endLive(st.meta.id).catch(e => console.error('[live] auto-fin:', e.message));
    }
  }, 20000);

  // Après un redémarrage du serveur : on retrouve les lives en cours
  let tries = 0;
  const boot = setInterval(async () => {
    if (++tries > 60) return clearInterval(boot);
    if (!isReady()) return;
    clearInterval(boot);
    try {
      const snap = await db().collection('lives').where('status', '==', 'live').get();
      for (const d of snap.docs) {
        const x = d.data();
        const st = newState({ id: d.id, sellerId: x.sellerId, sellerName: x.sellerName, sellerPhoto: x.sellerPhoto || '', city: x.city || '', country: x.country || '', coverUrl: x.coverUrl || '', status: 'live', startedAt: x.startedAt.toDate ? x.startedAt.toDate().getTime() : Date.now() });
        const items = await db().collection('products').where('liveId', '==', d.id).get();
        items.forEach(p => { const y = p.data(); if (y.status === 'live' || y.status === 'reserved') st.items.set(p.id, { id: p.id, name: y.title, price: y.price, category: y.category, status: y.status === 'live' ? 'available' : 'reserved' }); });
        LIVES.set(d.id, st);
      }
    } catch (e) { console.error('[live] reprise après redémarrage:', e.message); }
  }, 2000);
};
