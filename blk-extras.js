(function () {
  if (window.__blkExtras) return; window.__blkExtras = true;
  var $ = function (id) { return document.getElementById(id); };

  // =====================================================================
  // STYLES
  // =====================================================================
  var st = document.createElement('style');
  st.textContent = `
#ptr{position:fixed;top:-50px;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:var(--card-bg);box-shadow:0 4px 14px var(--shadow);display:flex;align-items:center;justify-content:center;z-index:3000;color:var(--accent);font-size:20px;transition:top .25s;}
#ptr.spin{animation:spin .8s linear infinite;}
#installBanner{position:fixed;left:12px;right:12px;bottom:92px;max-width:576px;margin:0 auto;background:var(--card-bg);border:2px solid var(--accent);border-radius:18px;padding:12px 14px;display:flex;align-items:center;gap:10px;z-index:1200;box-shadow:0 10px 30px var(--shadow);}
#installBanner img{width:42px;height:42px;border-radius:10px;}
#installBanner .t{flex:1;font-size:13px;font-weight:700;line-height:1.3;}
#installBanner button{border:none;border-radius:12px;padding:9px 14px;font-weight:800;font-size:13px;cursor:pointer;background:var(--accent);color:#fff;}
#installBanner button.x{background:transparent;color:#999;padding:6px;font-size:16px;}

/* Messages d'alerte toujours visibles, même au-dessus des écrans plein écran */
#alertBox{position:fixed !important;top:16px;left:12px;right:12px;max-width:576px;margin:0 auto !important;z-index:8000;box-shadow:0 8px 24px rgba(0,0,0,.2);}

/* La messagerie passe au-dessus de la fiche article */
#chatFullscreen{z-index:1600 !important;}
#btnToggleTheme{display:none !important;}

/* Fiche article : la photo s'affiche en entier, avec ses vraies proportions */
#productFullscreen .carousel-container{background:var(--input-bg);min-height:220px;}
#productFullscreen .carousel-track{align-items:center;}
#productFullscreen .carousel-slide img{aspect-ratio:auto !important;width:100%;height:auto !important;max-height:78vh;object-fit:contain !important;}

/* Accueil : les photos s'affichent à leur vraie taille, sans recadrage (deux colonnes comme Pinterest) */
.articles-grid{display:block !important;column-count:2;column-gap:10px;}
.articles-grid .article-card{break-inside:avoid;-webkit-column-break-inside:avoid;margin-bottom:10px;display:block;}
.articles-grid .article-card img{aspect-ratio:auto !important;width:100%;height:auto !important;object-fit:contain !important;display:block;}
.articles-grid > .empty,.articles-grid > p{column-span:all;}

/* Diaporama des photos d'une même publication */
.sl-dots{position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:center;gap:4px;pointer-events:none;z-index:3;}
.sl-dots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.6);box-shadow:0 0 3px rgba(0,0,0,.45);transition:all .3s;}
.sl-dots i.on{background:#fff;width:15px;border-radius:3px;}

/* Chargement : squelette et message de réveil du serveur */
.sk{break-inside:avoid;margin-bottom:10px;border-radius:16px;background:linear-gradient(90deg,var(--input-bg) 25%,var(--border) 50%,var(--input-bg) 75%);background-size:200% 100%;animation:skm 1.2s linear infinite;}
@keyframes skm{to{background-position:-200% 0;}}
#wakePill{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:7500;background:#252a47;color:#fff;border-radius:999px;padding:10px 18px;font-size:13px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.3);max-width:92vw;text-align:center;}

/* Petit guide du personnage pour les nouveaux inscrits */
#tourBubble{position:fixed;top:18px;right:10px;z-index:7900;width:min(300px,88vw);display:none;}
#tourBubble.show{display:block;animation:tourIn .45s cubic-bezier(.34,1.56,.64,1);}
@keyframes tourIn{from{opacity:0;transform:translateY(-14px) scale(.9);}to{opacity:1;transform:none;}}
@keyframes tourFloat{0%,100%{transform:translateY(-50%);}50%{transform:translateY(calc(-50% - 5px));}}
#tourBubble .tb-card{position:relative;background:var(--card-bg);border:2px solid var(--accent);border-radius:20px;padding:12px 30px 12px 84px;min-height:100px;box-shadow:0 14px 34px rgba(0,0,0,.28);}
#tourBubble .tb-card img{position:absolute;left:8px;top:50%;height:88px;width:auto;transform:translateY(-50%);animation:tourFloat 2.2s ease-in-out infinite;pointer-events:none;}
#tourBubble .tb-t{font-weight:800;font-size:14px;color:var(--accent);margin-bottom:3px;}
#tourBubble .tb-x{font-size:12.5px;line-height:1.45;color:var(--text);}
#tourBubble .tb-c{position:absolute;top:4px;right:6px;width:28px;height:28px;background:none;border:none;color:#999;font-size:16px;cursor:pointer;}

/* Bouton retour plus grand */
.chat-back-btn{font-size:42px !important;width:56px;height:56px;margin-left:-8px;display:flex !important;align-items:center;justify-content:center;line-height:1;padding:0 0 6px;}
.chat-menu-btn{background:none;border:none;color:var(--accent);font-size:30px;font-weight:900;width:48px;height:48px;cursor:pointer;line-height:1;flex-shrink:0;}

/* Logo sans cadre */
.app{padding-top:14px !important;}
.brand-row{padding-top:0;}
.brand-logo-img{width:104px;height:104px;}
.onboard-logo,.onboard-logo-welcome{width:128px;height:128px;}
.onboard-logo,.onboard-logo-welcome,.blk-splash-logo{filter:brightness(0) invert(1) drop-shadow(0 6px 18px rgba(0,0,0,.35)) !important;}

/* Liste des discussions */
.contact-row{gap:14px !important;padding:14px 4px !important;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;}
.contact-row-avatar{width:68px !important;height:68px !important;font-size:26px !important;}
.contact-row-name{font-size:19px !important;font-weight:800 !important;}
.contact-row-preview{font-size:16px !important;white-space:normal !important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#8e8e93 !important;line-height:1.35;margin-top:3px;}
.contact-row > div:last-child{align-self:stretch;justify-content:flex-start;padding-top:2px;}
.contact-row > div:last-child > span:first-child{font-size:15px !important;color:#8e8e93 !important;}
.contact-row.has-unread > div:last-child > span:first-child{color:#25D366 !important;font-weight:600;}
.contact-row-badge{min-width:28px !important;height:28px !important;font-size:15px !important;font-weight:700;background:#25D366 !important;}

/* Cartes de statistiques du magasin */
.shop-stats-grid{gap:14px !important;}
.stat-card{display:block !important;border-radius:28px !important;padding:16px 16px 14px !important;border:none !important;}
.stat-sales{background:linear-gradient(135deg,rgba(232,96,60,.16),rgba(232,96,60,.05)) !important;}
.stat-published{background:linear-gradient(135deg,rgba(63,169,245,.16),rgba(63,169,245,.05)) !important;}
.stat-revenue{background:linear-gradient(135deg,rgba(242,163,58,.18),rgba(242,163,58,.05)) !important;}
.stat-orders{background:linear-gradient(135deg,rgba(63,185,80,.16),rgba(63,185,80,.05)) !important;}
.sc-head{display:flex;align-items:center;gap:8px;margin-bottom:20px;}
.sc-ico svg{width:22px;height:22px;display:block;}
.sc-title{font-weight:700;font-size:16px;}
.sc-body{display:flex;align-items:center;justify-content:space-between;gap:6px;}
.sc-val{display:flex;flex-direction:column;min-width:0;}
.stat-card .stat-card-number{color:var(--text) !important;font-size:30px !important;font-weight:800 !important;line-height:1.1;}
.sc-unit{font-size:14px;color:#8e8e93;margin-top:2px;}
.sc-viz{flex-shrink:0;}
.sc-viz svg{display:block;}

/* Graphique des commandes */
.oc{background:var(--card-bg);border:1px solid var(--border);border-radius:28px;padding:18px 16px 12px;margin-bottom:16px;box-shadow:0 10px 30px var(--shadow);}
.oc-top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.oc-title{font-size:26px;font-weight:700;}
.oc-pill{background:var(--input-bg);border:1px solid var(--border);border-radius:16px;padding:9px 12px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;color:var(--text);}
.oc-legend{display:flex;flex-wrap:wrap;gap:6px 28px;margin:14px 0 8px;}
.oc-lg-label{font-size:12px;letter-spacing:1.2px;font-weight:700;color:#8e8ea0;text-transform:uppercase;display:flex;align-items:center;gap:8px;}
.oc-dash{width:13px;height:4px;border-radius:2px;display:inline-block;}
.oc-lg-val{font-size:30px;font-weight:700;display:flex;align-items:baseline;gap:8px;margin-top:2px;}
.oc-chg{font-size:13px;font-weight:700;}
.oc-chg.up{color:#0f9d58;}.oc-chg.down{color:#e5534b;}
.oc-wrap{position:relative;margin-top:2px;}
.oc-wrap svg{width:100%;height:auto;display:block;touch-action:pan-y;}
.oc-tip{position:absolute;top:0;width:150px;background:#252a47;color:#fff;border-radius:16px;padding:10px 14px;pointer-events:none;box-shadow:0 8px 20px rgba(0,0,0,.25);}
.oc-tip .d{font-size:12px;opacity:.85;margin-bottom:6px;}
.oc-tip .r{display:flex;gap:18px;}
.oc-tip b{font-size:20px;display:block;line-height:1.1;}
.oc-tip span{font-size:11px;opacity:.8;}
.oc-note{text-align:center;color:#8e8ea0;font-size:12px;margin-top:2px;}

/* Écran « pas de connexion » */
#offlineScreen{position:fixed;inset:0;z-index:100000;display:none;flex-direction:column;align-items:center;justify-content:center;background:#D3C5AE;text-align:center;padding:24px;}
#offlineScreen.show{display:flex;}
#offlineScreen svg{width:min(320px,86vw);height:auto;}
#offlineScreen h2{color:#4a3f35;font-size:26px;margin:14px 0 8px;}
#offlineScreen p{color:#7d7264;font-size:16px;line-height:1.5;max-width:300px;}
#offlineScreen button{margin-top:30px;background:#fff;color:#4a3f35;border:none;border-radius:999px;padding:18px 60px;font-size:16px;font-weight:800;letter-spacing:1.5px;box-shadow:0 14px 28px rgba(80,60,30,.25);cursor:pointer;}
#offlineScreen button:active{transform:scale(.97);}
`;
  document.head.appendChild(st);

  // =====================================================================
  // UPLOAD AVEC RÉESSAIS
  // =====================================================================
  window.uploadToImgbb = async function (base64Image) {
    var lastError = 'Impossible de joindre le serveur (vérifie ta connexion)';
    for (var attempt = 1; attempt <= 3; attempt++) {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 60000);
      try {
        var r = await apiFetch('/api/upload', { method: 'POST', body: JSON.stringify({ base64: base64Image }), signal: ctrl.signal });
        clearTimeout(timer);
        var data = await r.json().catch(function () { return {}; });
        if (data && data.success && data.url) return { url: data.url, error: null };
        lastError = (data && data.message) || ('Erreur serveur (code ' + r.status + ')');
        if (r.status === 413) return { url: null, error: 'Photo trop lourde' };
      } catch (err) {
        clearTimeout(timer);
        lastError = 'Serveur lent à répondre, réessaie dans un instant';
      }
      await new Promise(function (res) { setTimeout(res, 2000 * attempt); });
    }
    return { url: null, error: lastError };
  };

  // Photo obligatoire
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#pubSubmit');
    if (!b) return;
    if (!document.querySelector('#publishPhotos .publish-thumb')) {
      e.stopImmediatePropagation(); e.preventDefault();
      var s = $('pubStatus');
      if (s) { s.style.color = '#E74C3C'; s.textContent = 'Ajoute au moins une photo.'; }
    }
  }, true);

  // =====================================================================
  // FICHE ARTICLE : photo et nom actuels du vendeur
  // =====================================================================
  var origOpenProduct = window.openProductFullscreen;
  if (typeof origOpenProduct === 'function') {
    window.openProductFullscreen = function (product) {
      origOpenProduct(product);
      document.querySelectorAll('#pfCarousel img').forEach(function (im) { im.loading = 'eager'; });
      if (!product || !product.sellerId) return;
      apiFetch('/api/users/' + product.sellerId)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.success) return;
          var row = $('pfSellerRow');
          if (!row) return;
          var av = row.querySelector('.profile-avatar-new');
          if (av) {
            av.style.width = '48px'; av.style.height = '48px';
            av.innerHTML = d.data.photo
              ? safeImgTag(d.data.photo, d.data.name, 'width:100%;height:100%;object-fit:cover;')
              : escapeHtml((d.data.name || '?').charAt(0).toUpperCase());
          }
          var nameEl = row.querySelector('div:nth-child(2) > div:first-child');
          if (nameEl && d.data.name) nameEl.textContent = d.data.name;
        })
        .catch(function () {});
    };
  }

  // =====================================================================
  // MESSAGERIE : bloquer / supprimer une discussion
  // =====================================================================
  function removeLocalContact(id) {
    try {
      delete localContacts[id];
      localStorage.setItem(getLocalContactsKey(), JSON.stringify(localContacts));
    } catch (e) {}
  }

  function openContactMenu(id, name) {
    if (!id || typeof openModal !== 'function') return;
    var ov = openModal(
      '<div style="text-align:center;">' +
      '<h3 style="margin-bottom:6px;">' + escapeHtml(name || 'Contact') + '</h3>' +
      '<p id="cmStatus" style="color:#999;font-size:13px;margin-bottom:14px;min-height:18px;">Chargement…</p>' +
      '<button class="btn btn-outline" id="cmBlock" style="margin-bottom:8px;" disabled>Bloquer ce contact</button>' +
      '<button class="btn btn-danger" id="cmDelete" style="margin-bottom:8px;">Supprimer la discussion</button>' +
      '<button class="btn btn-outline" id="cmCancel">Annuler</button>' +
      '</div>');
    var status = ov.querySelector('#cmStatus');
    var blockBtn = ov.querySelector('#cmBlock');
    var isBlocked = false;
    function say(txt, color) { status.style.color = color || '#999'; status.textContent = txt; }
    function paintBlock() { blockBtn.textContent = isBlocked ? 'Débloquer ce contact' : 'Bloquer ce contact'; blockBtn.disabled = false; }

    apiFetch('/api/users/' + currentUserId).then(function (r) { return r.json(); }).then(function (d) {
      var list = (d && d.success && d.data && d.data.blockedUsers) || [];
      isBlocked = list.indexOf(id) > -1;
      say(isBlocked ? 'Ce contact est bloqué.' : '');
      paintBlock();
    }).catch(function () { say(''); paintBlock(); });

    ov.querySelector('#cmCancel').onclick = function () { ov.remove(); };
    blockBtn.onclick = function () {
      blockBtn.disabled = true;
      apiFetch('/api/users/block', { method: 'POST', body: JSON.stringify({ blockedId: id }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.success) {
            isBlocked = !!d.blocked;
            say(isBlocked ? 'Contact bloqué ✓' : 'Contact débloqué ✓', '#2ECC71');
            paintBlock();
            setTimeout(function () { ov.remove(); }, 1100);
          } else { say((d && d.message) || 'Erreur', '#E74C3C'); paintBlock(); }
        })
        .catch(function () { say('Erreur réseau', '#E74C3C'); paintBlock(); });
    };
    ov.querySelector('#cmDelete').onclick = function () {
      if (!confirm('Supprimer cette discussion ? Les messages disparaîtront de ton côté.')) return;
      say('Suppression…');
      apiFetch('/api/messages/delete-conversation', { method: 'POST', body: JSON.stringify({ contactId: id }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.success) {
            removeLocalContact(id);
            ov.remove();
            if (typeof activeConversationId !== 'undefined' && activeConversationId === id) {
              var back = $('btnCloseDiscussion'); if (back) back.click();
            }
            if (typeof loadMessages === 'function') loadMessages();
          } else { say((d && d.message) || 'Erreur', '#E74C3C'); }
        })
        .catch(function () { say('Erreur réseau', '#E74C3C'); });
    };
  }

  // Appui long sur une discussion
  function bindRow(row) {
    if (row.dataset.lp) return; row.dataset.lp = '1';
    var timer = null, fired = false;
    function nameOf() { var n = row.querySelector('.contact-row-name'); return n ? n.textContent : 'Contact'; }
    row.addEventListener('touchstart', function () {
      fired = false;
      timer = setTimeout(function () { fired = true; if (navigator.vibrate) navigator.vibrate(15); openContactMenu(row.dataset.id, nameOf()); }, 550);
    }, { passive: true });
    ['touchend', 'touchmove', 'touchcancel'].forEach(function (ev) {
      row.addEventListener(ev, function () { clearTimeout(timer); }, { passive: true });
    });
    row.addEventListener('contextmenu', function (e) { e.preventDefault(); openContactMenu(row.dataset.id, nameOf()); });
    row.addEventListener('click', function (e) {
      if (fired) { e.stopImmediatePropagation(); e.preventDefault(); fired = false; }
    }, true);
  }
  function decorateContacts() {
    var cl = $('contactsList'); if (!cl) return;
    cl.querySelectorAll('.contact-row').forEach(function (row) {
      row.classList.toggle('has-unread', !!row.querySelector('.contact-row-badge'));
      bindRow(row);
    });
  }
  var cl = $('contactsList');
  if (cl) { new MutationObserver(decorateContacts).observe(cl, { childList: true }); decorateContacts(); }
  var h2m = document.querySelector('#pageMessages h2');
  if (h2m && !$('msgHint')) {
    var hint = document.createElement('p'); hint.id = 'msgHint';
    hint.style.cssText = 'color:#999;font-size:12.5px;margin:4px 0 8px;';
    hint.textContent = 'Maintiens appuyé sur une discussion pour la bloquer ou la supprimer.';
    h2m.insertAdjacentElement('afterend', hint);
  }

  // Bouton ⋮ dans l'en-tête d'une discussion
  var cf = $('chatFullscreen');
  if (cf) {
    new MutationObserver(function () {
      var h = cf.querySelector('.chat-header');
      if (h && h.querySelector('#btnCloseDiscussion') && !h.querySelector('#btnChatMenu')) {
        var b = document.createElement('button');
        b.id = 'btnChatMenu'; b.className = 'chat-menu-btn'; b.type = 'button'; b.textContent = '⋮';
        b.onclick = function () {
          var n = h.querySelector('.chat-contact-name');
          openContactMenu(activeConversationId, n ? n.textContent : 'Contact');
        };
        h.appendChild(b);
      }
    }).observe(cf, { childList: true });
  }

  // =====================================================================
  // MAGASIN : cartes + graphique des commandes
  // =====================================================================
  var BLUE = '#2a22f0', RED = '#f0141e';
  function fmtDate(d) { return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function dayKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function pct(cur, prev) { return prev > 0 ? Math.round((cur - prev) / prev * 100) : (cur > 0 ? 100 : 0); }
  function chg(cur, prev) {
    var p = pct(cur, prev), up = p >= 0;
    return '<span class="oc-chg ' + (up ? 'up' : 'down') + '">' + (up ? '▲' : '▼') + ' ' + Math.abs(p) + '%</span>';
  }

  function buildSeries(orders, nDays) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var days = [], idx = {};
    for (var i = nDays - 1; i >= 0; i--) {
      var d = new Date(today); d.setDate(today.getDate() - i);
      idx[dayKey(d)] = days.length; days.push({ date: d, placed: 0, pending: 0 });
    }
    var prevStart = new Date(today); prevStart.setDate(today.getDate() - nDays * 2 + 1);
    var out = { days: days, prevPlaced: 0, prevPending: 0, placedTotal: 0, pendingTotal: 0, allReceived: 0 };
    orders.forEach(function (o) {
      if (o.sellerId !== currentUserId) return;
      out.allReceived++;
      var cd = parseServerDate(o.createdAt); if (!cd) return;
      var pending = String(o.status || '').toLowerCase().indexOf('attente') > -1;
      var k = dayKey(cd);
      if (k in idx) {
        var row = days[idx[k]]; row.placed++; out.placedTotal++;
        if (pending) { row.pending++; out.pendingTotal++; }
      } else if (cd >= prevStart && cd < days[0].date) {
        out.prevPlaced++; if (pending) out.prevPending++;
      }
    });
    return out;
  }

  function drawOrdersChart(orders) {
    var body = $('ocBody'); if (!body) return;
    var S = buildSeries(orders, 14), days = S.days, N = days.length;
    var W = 340, H = 246, L = 30, R = 10, T = 78, B = 26, pw = W - L - R, ph = H - T - B;
    var maxRaw = 0; days.forEach(function (d) { if (d.placed > maxRaw) maxRaw = d.placed; });
    var maxV = Math.max(4, Math.ceil(maxRaw / 4) * 4);
    function X(i) { return L + i * pw / (N - 1); }
    function Y(v) { return T + ph * (1 - v / maxV); }
    var grid = '', ylab = '', vl = '', xl = '', i;
    for (var g = 0; g <= 4; g++) {
      var v = maxV * g / 4, y = Y(v);
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="var(--border)" stroke-width="1"/>';
      ylab += '<text x="' + (L - 8) + '" y="' + (y + 3.5) + '" text-anchor="end" font-size="10" fill="#9aa0b4">' + Math.round(v) + '</text>';
    }
    for (i = 0; i < N; i++) {
      vl += '<line x1="' + X(i) + '" x2="' + X(i) + '" y1="' + T + '" y2="' + (T + ph) + '" stroke="var(--border)" stroke-dasharray="2 4" opacity=".7"/>';
      xl += '<text class="oc-xl" x="' + X(i) + '" y="' + (T + ph + 18) + '" text-anchor="middle" font-size="10" fill="#9aa0b4">' + days[i].date.getDate() + '</text>';
    }
    function pathOf(key) { var d = ''; days.forEach(function (p, k) { d += (k ? 'L' : 'M') + X(k).toFixed(1) + ',' + Y(p[key]).toFixed(1) + ' '; }); return d; }
    function areaOf(key) { return pathOf(key) + 'L' + X(N - 1).toFixed(1) + ',' + Y(0) + ' L' + X(0).toFixed(1) + ',' + Y(0) + ' Z'; }

    body.innerHTML =
      '<svg id="ocSvg" viewBox="0 0 ' + W + ' ' + H + '">' +
      '<defs><linearGradient id="ocg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + BLUE + '" stop-opacity=".2"/><stop offset="1" stop-color="' + BLUE + '" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="ocg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + RED + '" stop-opacity=".14"/><stop offset="1" stop-color="' + RED + '" stop-opacity="0"/></linearGradient></defs>' +
      grid + vl + ylab +
      '<path d="' + areaOf('placed') + '" fill="url(#ocg1)"/><path d="' + areaOf('pending') + '" fill="url(#ocg2)"/>' +
      '<path d="' + pathOf('placed') + '" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="' + pathOf('pending') + '" fill="none" stroke="' + RED + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<line id="ocLine" stroke="#252a47" stroke-width="1.5"/>' +
      '<circle id="ocD1" r="5" fill="#fff" stroke="' + BLUE + '" stroke-width="2.5"/>' +
      '<circle id="ocD2" r="5" fill="#fff" stroke="' + RED + '" stroke-width="2.5"/>' + xl + '</svg>' +
      '<div class="oc-tip" id="ocTip"></div>';

    function select(k) {
      var d = days[k], x = X(k), ln = $('ocLine');
      ln.setAttribute('x1', x); ln.setAttribute('x2', x); ln.setAttribute('y1', T - 8); ln.setAttribute('y2', T + ph);
      $('ocD1').setAttribute('cx', x); $('ocD1').setAttribute('cy', Y(d.placed));
      $('ocD2').setAttribute('cx', x); $('ocD2').setAttribute('cy', Y(d.pending));
      var tip = $('ocTip');
      tip.innerHTML = '<div class="d">' + fmtDate(d.date) + '</div><div class="r"><div><b>' + d.placed + '</b><span>Passées</span></div><div><b>' + d.pending + '</b><span>En attente</span></div></div>';
      var ww = body.clientWidth || 320, px = x / W * ww;
      tip.style.left = Math.max(0, Math.min(ww - 150, px - 75)) + 'px';
      body.querySelectorAll('.oc-xl').forEach(function (t, j) {
        t.setAttribute('font-weight', j === k ? '800' : '400');
        t.setAttribute('fill', j === k ? 'var(--text)' : '#9aa0b4');
      });
    }
    var svg = $('ocSvg');
    function pick(e) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W;
      select(Math.max(0, Math.min(N - 1, Math.round((x - L) / (pw / (N - 1))))));
    }
    svg.addEventListener('pointerdown', pick); svg.addEventListener('pointermove', pick);
    select(N - 1);

    $('ocLegend').innerHTML =
      '<div><div class="oc-lg-label">Passées <span class="oc-dash" style="background:' + BLUE + '"></span></div><div class="oc-lg-val">' + S.placedTotal + chg(S.placedTotal, S.prevPlaced) + '</div></div>' +
      '<div><div class="oc-lg-label">En attente <span class="oc-dash" style="background:' + RED + '"></span></div><div class="oc-lg-val">' + S.pendingTotal + chg(S.pendingTotal, S.prevPending) + '</div></div>';
    $('ocNote').textContent = S.placedTotal === 0 ? 'Aucune commande sur les 14 derniers jours.' : 'Touche le graphique pour voir un jour précis.';
    return S;
  }

  // ----- mini graphiques des 4 cartes -----
  function ringSvg(ratio, color) {
    var r = 22, c = 2 * Math.PI * r, len = c * Math.max(0, Math.min(1, ratio));
    return '<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="none" stroke="' + color + '" stroke-opacity=".2" stroke-width="9"/>' +
      (len > 0.5 ? '<circle cx="32" cy="32" r="22" fill="none" stroke="' + color + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + len.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 32 32)"/>' : '') + '</svg>';
  }
  function barsSvg(values, color) {
    var w = 78, h = 56, n = values.length, bw = 8, gap = (w - n * bw) / (n - 1), max = Math.max.apply(null, values.concat([1])), mi = values.indexOf(Math.max.apply(null, values)), s = '';
    values.forEach(function (v, i) {
      var bh = Math.max(7, v / max * h);
      s += '<rect x="' + (i * (bw + gap)).toFixed(1) + '" y="' + (h - bh).toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="4" fill="' + color + '" opacity="' + (v > 0 && i === mi ? 1 : 0.35) + '"/>';
    });
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + s + '</svg>';
  }
  function sparkSvg(values, color, gid) {
    var w = 84, h = 50, pad = 6;
    if (!values.length) values = [0, 0]; if (values.length === 1) values = [values[0], values[0]];
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values), span = max - min;
    var pts = values.map(function (v, i) {
      return [i * (w / (values.length - 1)), span === 0 ? h / 2 : pad + (h - 2 * pad) * (1 - (v - min) / span)];
    });
    var d = 'M' + pts[0][0] + ',' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i], cx = (p0[0] + p1[0]) / 2;
      d += ' C' + cx.toFixed(1) + ',' + p0[1].toFixed(1) + ' ' + cx.toFixed(1) + ',' + p1[1].toFixed(1) + ' ' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1);
    }
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".3"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + d + ' L' + w + ',' + h + ' L0,' + h + ' Z" fill="url(#' + gid + ')"/><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  function drawMiniViz(S, orders, arts) {
    var sold = (typeof statsData !== 'undefined' && statsData && statsData.totalSales) || 0;
    var pub = (typeof statsData !== 'undefined' && statsData && statsData.totalArticles) || 0;
    var hist = (typeof statsData !== 'undefined' && statsData && Array.isArray(statsData.history)) ? statsData.history.slice(-6).map(function (h) { return h.revenu || 0; }) : [];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var artDays = [0, 0, 0, 0, 0, 0, 0];
    arts.forEach(function (a) {
      var cd = parseServerDate(a.createdAt); if (!cd) return;
      var diff = Math.round((today - new Date(cd.getFullYear(), cd.getMonth(), cd.getDate())) / 86400000);
      if (diff >= 0 && diff < 7) artDays[6 - diff]++;
    });
    var set = function (id, html) { var el = $(id); if (el) el.innerHTML = html; };
    set('vzSales', ringSvg(sold + pub > 0 ? sold / (sold + pub) : 0, '#E8603C'));
    set('vzPub', barsSvg(artDays, '#3FA9F5'));
    set('vzRev', sparkSvg(hist, '#F2A33A', 'sgRev'));
    set('vzOrd', sparkSvg(S.days.map(function (d) { return d.placed; }), '#3FB950', 'sgOrd'));
    var no = $('statTotalOrders'); if (no) no.textContent = S.allReceived;
  }

  function buildShopUI() {
    var grid = document.querySelector('.shop-stats-grid');
    if (grid && !grid.dataset.v2) {
      grid.dataset.v2 = '1';
      [['.stat-sales', '#E8603C', 'Vendus', 'statTotalSales', 'articles', 'vzSales'],
       ['.stat-published', '#3FA9F5', 'Publiés', 'statTotalArticles', 'articles', 'vzPub'],
       ['.stat-revenue', '#F2A33A', 'Revenus', 'statTotalRevenue', 'FCFA', 'vzRev'],
       ['.stat-orders', '#3FB950', 'Commandes', 'statTotalOrders', 'reçues', 'vzOrd']].forEach(function (d) {
        var card = grid.querySelector(d[0]); if (!card) return;
        var svg = card.querySelector('.stat-card-icon svg'), cur = $(d[3]);
        card.innerHTML = '<div class="sc-head"><span class="sc-ico" style="color:' + d[1] + '">' + (svg ? svg.outerHTML : '') + '</span><span class="sc-title">' + d[2] + '</span></div>' +
          '<div class="sc-body"><div class="sc-val"><span class="stat-card-number" id="' + d[3] + '">' + (cur ? cur.textContent : '0') + '</span><span class="sc-unit">' + d[4] + '</span></div><div class="sc-viz" id="' + d[5] + '"></div></div>';
      });
    }
    var chart = document.querySelector('.eval-chart');
    if (chart && !chart.dataset.v2) {
      chart.dataset.v2 = '1'; chart.className = 'oc';
      chart.innerHTML = '<div class="oc-top"><div class="oc-title">Commandes</div><div class="oc-pill">14 derniers jours <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></div></div>' +
        '<div class="oc-legend" id="ocLegend"></div><div class="oc-wrap" id="ocBody"></div><div class="oc-note" id="ocNote"></div>';
    }
  }

  function refreshShop() {
    if (typeof currentUserId === 'undefined' || !currentUserId) return;
    buildShopUI();
    Promise.all([
      apiFetch('/api/orders/' + currentUserId).then(function (r) { return r.json(); }).catch(function () { return []; }),
      apiFetch('/api/articles/seller/' + currentUserId).then(function (r) { return r.json(); }).catch(function () { return {}; })
    ]).then(function (res) {
      var orders = Array.isArray(res[0]) ? res[0] : [];
      var arts = (res[1] && res[1].data) || [];
      var S = drawOrdersChart(orders);
      if (S) drawMiniViz(S, orders, arts);
    });
  }
  buildShopUI();
  window.renderSalesChart = function () { refreshShop(); };

  // =====================================================================
  // ÉCRAN « PAS DE CONNEXION »
  // =====================================================================
  var off = document.createElement('div');
  off.id = 'offlineScreen';
  off.innerHTML =
    '<svg viewBox="0 0 340 250" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="150" cy="226" rx="130" ry="14" fill="rgba(70,52,30,.18)"/>' +
    '<path d="M262 128h64l-9 70h-46z" fill="#fff"/>' +
    '<path d="M294 130C270 110 268 70 282 52C296 72 298 100 294 130Z" fill="#8ecf86"/>' +
    '<path d="M296 130C310 100 322 80 334 74C336 100 318 122 296 130Z" fill="#a6dd9d"/>' +
    '<path d="M292 130C276 118 262 112 252 112C258 126 272 132 292 130Z" fill="#79bf72"/>' +
    '<rect x="66" y="36" width="9" height="84" rx="4.5" fill="#2a2a2a"/><rect x="206" y="36" width="9" height="84" rx="4.5" fill="#2a2a2a"/>' +
    '<rect x="44" y="116" width="190" height="94" rx="16" fill="#2a2a2a"/><rect x="44" y="116" width="190" height="12" rx="6" fill="#3a3a3a"/>' +
    '<circle cx="68" cy="146" r="4.5" fill="#4caf50"/><circle cx="96" cy="146" r="4.5" fill="#4caf50"/><circle cx="110" cy="146" r="4.5" fill="#e5534b"/>' +
    '<circle cx="150" cy="146" r="4.5" fill="#555"/><circle cx="166" cy="146" r="4.5" fill="#555"/><circle cx="182" cy="146" r="4.5" fill="#555"/><circle cx="198" cy="146" r="4.5" fill="#555"/>' +
    '<path d="M92 176q11 9 22 0M146 176q11 9 22 0" stroke="#0d0d0d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M124 190q3 4 6 0" stroke="#0d0d0d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<text x="214" y="74" font-size="18" font-weight="700" fill="#a79b88">z</text><text x="230" y="56" font-size="24" font-weight="700" fill="#a79b88">z</text><text x="250" y="34" font-size="30" font-weight="700" fill="#a79b88">z</text>' +
    '</svg>' +
    '<h2>Pas de connexion</h2>' +
    '<p id="offMsg">Aucune connexion internet. Vérifie ton Wi-Fi ou tes données mobiles.</p>' +
    '<button type="button" id="offClose">FERMER</button>';
  document.body.appendChild(off);

  function updateOffline() { off.classList.toggle('show', navigator.onLine === false); }
  window.addEventListener('offline', updateOffline);
  window.addEventListener('online', function () {
    updateOffline();
    try { if (currentUserId) { loadProducts(); loadMessages(); loadWallet(); } } catch (e) {}
  });
  updateOffline();
  $('offClose').onclick = function () {
    try { window.close(); } catch (e) {}
    setTimeout(function () {
      // Si le navigateur refuse de fermer l'app (cas de l'iPhone), on explique comment la quitter.
      $('offMsg').textContent = 'Ton téléphone ne permet pas à une application de se fermer seule. Balaye vers le haut depuis le bas de l\'écran pour la quitter.';
      $('offClose').style.display = 'none';
    }, 350);
  };

  // =====================================================================
  // TIRER POUR ACTUALISER
  // =====================================================================
  var ptr = $('ptr');
  if (!ptr) { ptr = document.createElement('div'); ptr.id = 'ptr'; ptr.textContent = '↓'; document.body.appendChild(ptr); }
  var startY = 0, pulling = false, dist = 0, busy = false;
  function blocked() { return document.querySelector('.chat-fullscreen.active, .modal-overlay.active, .warning-fullscreen.active, .onboard-screen.active, #offlineScreen.show'); }
  window.addEventListener('touchstart', function (e) {
    if (busy || window.scrollY > 0 || blocked()) return;
    startY = e.touches[0].clientY; pulling = true; dist = 0;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (!pulling) return;
    dist = e.touches[0].clientY - startY;
    if (dist > 0) {
      ptr.style.top = (Math.min(dist / 2, 80) - 40) + 'px';
      ptr.style.transform = 'translateX(-50%) rotate(' + (dist * 3) + 'deg)';
    }
  }, { passive: true });
  window.addEventListener('touchend', function () {
    if (!pulling) return;
    pulling = false;
    if (dist > 110) {
      busy = true; ptr.textContent = '⟳'; ptr.classList.add('spin'); ptr.style.top = '70px';
      var t = document.querySelector('.tab-item.active');
      var tab = t && t.dataset.tab;
      loadProducts(); loadWallet(); loadFlames(currentUserId);
      if (tab === 'pageShop') { loadShopArticles(); loadStats(); loadPendingSales(); }
      if (tab === 'pageMessages') loadMessages();
      if (tab === 'pageOrders') loadOrders();
      setTimeout(function () { ptr.classList.remove('spin'); ptr.textContent = '↓'; ptr.style.top = '-50px'; busy = false; }, 1000);
    } else { ptr.style.top = '-50px'; }
  });

  // =====================================================================
  // INSTALLATION DE L'APPLICATION
  // =====================================================================
  var deferred = null;
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  function hidden() { return parseInt(localStorage.getItem('blk_install_hide') || '0', 10) > Date.now(); }
  function showBanner() {
    if (standalone || hidden() || $('installBanner')) return;
    var d = document.createElement('div'); d.id = 'installBanner';
    d.innerHTML = '<img src="icon-192.png" alt="BLK"><div class="t">Installe BLK Marketplace sur ton téléphone</div><button id="ibInstall">Installer</button><button class="x" id="ibClose">✕</button>';
    document.body.appendChild(d);
    $('ibClose').onclick = function () { localStorage.setItem('blk_install_hide', String(Date.now() + 3 * 86400000)); d.remove(); };
    $('ibInstall').onclick = function () { d.remove(); doInstall(); };
  }
  window.addEventListener('beforeinstallprompt', function (e) { deferred = e; setTimeout(showBanner, 2500); });
  window.addEventListener('appinstalled', function () { var b = $('installBanner'); if (b) b.remove(); });
  if (ios && !standalone) setTimeout(showBanner, 3000);

  function isSafariIos() { return ios && /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios|opios/i.test(navigator.userAgent); }
  function infoModal(title, html) {
    if (typeof openModal !== 'function') { alert(title); return; }
    var ov = openModal('<div style="text-align:center;"><div style="font-size:40px;margin-bottom:8px;">📲</div><h3 style="margin-bottom:10px;">' + title + '</h3><div style="color:#666;font-size:14px;line-height:1.7;text-align:left;">' + html + '</div><button class="btn btn-primary" id="dlOk" style="margin-top:14px;">J\'ai compris</button></div>');
    ov.querySelector('#dlOk').onclick = function () { ov.remove(); };
  }
  function doInstall() {
    if (deferred) {
      try { deferred.prompt(); deferred = null; return; } catch (e) { deferred = null; }
    }
    if (ios) {
      if (!isSafariIos()) infoModal('Ouvre dans Safari', 'Sur iPhone, l\'installation se fait depuis <strong>Safari</strong>. Copie le lien de ce site, ouvre-le dans Safari, puis appuie sur le bouton <strong>Partager</strong> et <strong>« Sur l\'écran d\'accueil »</strong>.');
      else infoModal('Installer BLK Marketplace', '1. Appuie sur le bouton <strong>Partager</strong> (le carré avec une flèche vers le haut)<br>2. Fais défiler et appuie sur <strong>« Sur l\'écran d\'accueil »</strong><br>3. Appuie sur <strong>« Ajouter »</strong>');
      return;
    }
    infoModal('Installer BLK Marketplace', '<strong>Android :</strong> ouvre le menu du navigateur (les 3 points) et choisis <strong>« Installer l\'application »</strong> ou <strong>« Ajouter à l\'écran d\'accueil »</strong>.<br><br><strong>Ordinateur (Chrome / Edge) :</strong> clique sur l\'icône d\'installation à droite de la barre d\'adresse, ou ouvre le menu et choisis <strong>« Installer BLK Marketplace »</strong>.');
  }
  function addDownloadButtons() {
    if (standalone) return;
    var wb = document.querySelector('#onbWelcome .onboard-bottom');
    if (wb && !$('dlWelcome')) {
      var b1 = document.createElement('button');
      b1.id = 'dlWelcome'; b1.className = 'onboard-btn-main'; b1.type = 'button';
      b1.style.cssText = 'margin-top:12px;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.85);box-shadow:none;';
      b1.textContent = '📲 Télécharger l\'application'; b1.onclick = doInstall; wb.appendChild(b1);
    }
    var pb = document.querySelector('.promo-banner');
    if (pb && !$('dlHome')) {
      var b2 = document.createElement('button');
      b2.id = 'dlHome'; b2.className = 'btn btn-outline'; b2.type = 'button'; b2.style.cssText = 'margin-bottom:12px;';
      b2.textContent = '📲 Télécharger l\'application'; b2.onclick = doInstall; pb.insertAdjacentElement('afterend', b2);
    }
    var pbtn = $('btnInstallApp'); if (pbtn) pbtn.style.display = 'flex';
  }
  addDownloadButtons();
  window.addEventListener('appinstalled', function () {
    ['dlWelcome', 'dlHome'].forEach(function (id) { var el = $(id); if (el) el.remove(); });
  });
  // =====================================================================
  // COMMANDES : seul l'acheteur peut confirmer la réception ; le vendeur voit seulement le temps restant
  // =====================================================================
  var origConfirmModal = window.openOrderConfirmModal;
  if (typeof origConfirmModal === 'function') {
    window.openOrderConfirmModal = function (order) {
      if (order && order.buyerId && order.buyerId !== currentUserId) return;
      origConfirmModal(order);
    };
  }
  window.loadOrders = function () {
    if (!currentUserId) return;
    apiFetch('/api/orders/' + currentUserId)
      .then(function (r) { return r.json(); })
      .then(function (orders) {
        var container = $('ordersList'), empty = $('emptyOrders');
        if (!container) return;
        if (ordersTimerInterval) { clearInterval(ordersTimerInterval); ordersTimerInterval = null; }
        if (!Array.isArray(orders) || orders.length === 0) { container.innerHTML = ''; empty.style.display = 'block'; return; }
        empty.style.display = 'none';
        container.innerHTML = '';
        var timerTargets = [];
        orders.forEach(function (order) {
          var card = document.createElement('div');
          card.className = 'glass'; card.style.marginBottom = '10px';
          var isBuyer = order.buyerId === currentUserId;
          var articleTitle = (order.article && order.article.title) || 'Article';
          var amount = isBuyer ? (order.totalAmount || order.amount || 0) : (order.amount || order.totalAmount || 0);
          var st = String(order.status || '').toLowerCase();
          var isFailed = ['expiré', 'expire', 'échoué', 'echoue', 'échouée', 'echouee'].indexOf(st) > -1;
          var isDone = ['livré', 'livre', 'annulé', 'annule'].indexOf(st) > -1;
          var isActive = !isFailed && !isDone;
          var createdAt = parseServerDate(order.createdAt);
          var deadline = createdAt ? createdAt.getTime() + PROTECTION_WINDOW_MS : null;
          var alreadyExpired = isActive && deadline && deadline <= Date.now();
          var hint = '';
          if (isActive && !alreadyExpired) {
            hint = isBuyer
              ? '<br><span style="font-size:12px;color:var(--accent3);font-weight:700;">Toucher pour confirmer la réception ➜</span>'
              : '<br><span style="font-size:12px;color:var(--accent2);font-weight:700;">En attente de la confirmation de l\'acheteur</span>';
          }
          var tag = '<span style="display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;margin-bottom:4px;background:' + (isBuyer ? 'rgba(52,152,219,.15);color:#3498DB' : 'rgba(46,204,113,.15);color:var(--accent3)') + ';">' + (isBuyer ? 'Mon achat' : 'Ma vente') + '</span><br>';
          var info = document.createElement('div');
          info.innerHTML = tag + '<strong>' + escapeHtml(articleTitle) + '</strong><br>' + amount + ' FCFA<br><span style="font-size:12px;color:' + (isFailed ? 'var(--accent)' : '#999') + ';font-weight:' + (isFailed ? '700' : '400') + ';">Statut: ' + (isFailed ? 'Échouée' : escapeHtml(order.status || 'En attente')) + '</span>' + hint;
          card.appendChild(info);
          if (isActive && deadline && !alreadyExpired) {
            var pill = createOrderTimerPill(deadline); card.appendChild(pill.el);
            timerTargets.push({ update: pill.update, order: order });
          }
          if (isActive && !alreadyExpired && isBuyer) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function () { openOrderConfirmModal(order); });
          } else if (alreadyExpired) { handleOrderExpired(order); }
          container.appendChild(card);
        });
        if (timerTargets.length > 0) {
          ordersTimerInterval = setInterval(function () {
            timerTargets.forEach(function (t) { if (!t.update()) handleOrderExpired(t.order); });
          }, 1000);
        }
      })
      .catch(function (e) { console.error(e); var c = $('ordersList'); if (c) c.innerHTML = '<p class="empty">Erreur chargement</p>'; });
  };

  // =====================================================================
  // DÉMARRAGE RAPIDE : images paresseuses, squelette et message de réveil du serveur
  // =====================================================================
  var origSafeImg = window.safeImgTag;
  if (typeof origSafeImg === 'function') {
    window.safeImgTag = function () {
      return String(origSafeImg.apply(this, arguments)).replace(/^<img /, '<img loading="lazy" decoding="async" ');
    };
  }
  (function () {
    var grid = $('productsGrid');
    var logged = typeof authToken !== 'undefined' && authToken;
    if (grid && logged && !grid.children.length && !window.__articlesLoaded) {
      var h = [150, 210, 180, 240, 170, 200], sk = '';
      h.forEach(function (x) { sk += '<div class="sk" style="height:' + x + 'px"></div>'; });
      grid.innerHTML = sk;
    }
    setTimeout(function () {
      if (window.__articlesLoaded || !logged || navigator.onLine === false) return;
      if (document.querySelector('#productsGrid .article-card')) return;
      var pill = document.createElement('div');
      pill.id = 'wakePill'; pill.textContent = '⏳ Le serveur se réveille, ça peut prendre jusqu\'à 1 minute…';
      document.body.appendChild(pill);
      document.addEventListener('blk-articles-loaded', function () { pill.remove(); });
      setTimeout(function () { if (pill.parentNode) pill.remove(); }, 90000);
    }, 6000);
  })();

  // =====================================================================
  // ACCUEIL : les photos d'une même publication défilent toutes les 3 secondes
  // =====================================================================
  function productImages(p) {
    var list = [];
    if (p && p.image) list.push(p.image);
    if (p && Array.isArray(p.images)) p.images.forEach(function (u) { if (u && list.indexOf(u) === -1) list.push(u); });
    return list.slice(0, 8);
  }
  function setupSlide(card, imgs) {
    if (card.dataset.sl) return; card.dataset.sl = '1';
    card.style.position = 'relative';
    function mk() {
      var i = document.createElement('img');
      i.className = 'sl-layer'; i.alt = ''; i.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .6s ease;background:var(--input-bg);pointer-events:none;';
      card.appendChild(i); return i;
    }
    var dots = document.createElement('div'); dots.className = 'sl-dots';
    dots.innerHTML = imgs.map(function (_, k) { return '<i class="' + (k === 0 ? 'on' : '') + '"></i>'; }).join('');
    var A = mk(), B = mk(); card.appendChild(dots);
    card._sl = { imgs: imgs, idx: 0, A: A, B: B, cur: null, dots: dots };
  }
  function paintDots(s) {
    var d = s.dots.children;
    for (var k = 0; k < d.length; k++) d[k].className = k === s.idx ? 'on' : '';
  }
  function advanceSlide(card) {
    var s = card._sl; if (!s) return;
    var next = (s.idx + 1) % s.imgs.length;
    if (next === 0) {
      if (s.cur) s.cur.style.opacity = 0;
      s.cur = null; s.idx = 0; paintDots(s); return;
    }
    var idle = (s.cur === s.A) ? s.B : s.A, old = s.cur, url = s.imgs[next];
    function show() {
      idle.style.opacity = 1; s.cur = idle; s.idx = next; paintDots(s);
      if (old) setTimeout(function () { if (s.cur !== old) old.style.opacity = 0; }, 700);
    }
    idle.style.zIndex = 2; if (old) old.style.zIndex = 1;
    idle.style.opacity = 0;
    if (idle.getAttribute('src') === url && idle.complete) { show(); return; }
    idle.onload = function () { idle.onload = null; show(); };
    idle.onerror = function () { idle.onerror = null; };
    idle.src = url;
  }
  function inView(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < (window.innerHeight || 800); }
  function decorateSlides() {
    var grid = $('productsGrid'); if (!grid || typeof allProducts === 'undefined') return;
    grid.querySelectorAll('.article-card').forEach(function (card) {
      if (card.dataset.sl) return;
      var base = card.querySelector('img'); if (!base) return;
      var src = base.getAttribute('src');
      var prod = allProducts.filter(function (p) { return (p.image || (p.images && p.images[0])) === src; })[0];
      var imgs = prod ? productImages(prod) : [];
      if (imgs.length > 1) setupSlide(card, imgs);
    });
  }
  var pg = $('productsGrid');
  if (pg) { new MutationObserver(decorateSlides).observe(pg, { childList: true }); decorateSlides(); }
  setInterval(function () {
    if (document.hidden) return;
    document.querySelectorAll('#productsGrid .article-card[data-sl]').forEach(function (card) {
      if (!inView(card)) return;
      setTimeout(function () { advanceSlide(card); }, Math.random() * 1200);
    });
  }, 3000);

  // =====================================================================
  // PETIT GUIDE (personnage) pour les nouveaux inscrits : explique chaque onglet
  // =====================================================================
  var TOUR = {
    pageHome: ['Accueil', 'Ici tu découvres tous les articles. Cherche un article ou un vendeur, filtre par catégorie et touche une photo pour l\'ouvrir.'],
    pageShop: ['Magasin', 'C\'est ta boutique ! Publie tes articles et suis tes ventes, tes revenus et tes commandes grâce aux graphiques.'],
    pageMessages: ['Messages', 'Discute avec les vendeurs et les acheteurs. Maintiens appuyé sur une discussion pour la bloquer ou la supprimer.'],
    pageOrders: ['Commandes', 'Retrouve tes achats et tes ventes. Quand tu reçois ton colis, touche ta commande pour confirmer la réception : le vendeur est payé à ce moment-là.'],
    pageProfile: ['Profil', 'Ton Wallet BLK, tes flammes 🔥 et ton compte. Pense à retirer ton argent vers ton Mobile Money quand une vente est terminée.']
  };
  var tb = document.createElement('div');
  tb.id = 'tourBubble';
  tb.innerHTML = '<div class="tb-card"><img src="mascot.png" alt=""><button class="tb-c" type="button" aria-label="Fermer">✕</button><div class="tb-t"></div><div class="tb-x"></div></div>';
  document.body.appendChild(tb);
  var tbTimer = null;
  function tourKey() { return 'blk_tour_' + (typeof currentUserId !== 'undefined' && currentUserId ? currentUserId : 'x'); }
  function tourState() { try { return JSON.parse(localStorage.getItem(tourKey()) || 'null'); } catch (e) { return null; } }
  function saveTour(o) { try { localStorage.setItem(tourKey(), JSON.stringify(o)); } catch (e) {} }
  function hideTip() { tb.classList.remove('show'); clearTimeout(tbTimer); }
  tb.querySelector('.tb-c').onclick = hideTip;
  function showTip(tab) {
    var st = tourState();
    if (!st || !st.active || !TOUR[tab] || (st.seen && st.seen[tab])) return;
    st.seen = st.seen || {}; st.seen[tab] = 1;
    if (Object.keys(TOUR).every(function (k) { return st.seen[k]; })) st.active = false;
    saveTour(st);
    tb.querySelector('.tb-t').textContent = 'Flammy · ' + TOUR[tab][0];
    tb.querySelector('.tb-x').textContent = TOUR[tab][1];
    tb.classList.remove('show'); void tb.offsetWidth; tb.classList.add('show');
    clearTimeout(tbTimer); tbTimer = setTimeout(hideTip, 15000);
  }
  // Le guide ne démarre que pour une nouvelle inscription
  var origGoOnboard = window.goToOnboardScreen;
  if (typeof origGoOnboard === 'function') {
    window.goToOnboardScreen = function (id) {
      if (id === 'onbWelcomeName') { try { localStorage.setItem('blk_tour_pending', '1'); } catch (e) {} }
      return origGoOnboard.apply(this, arguments);
    };
  }
  function startTourIfPending() {
    var appEl = $('appContainer');
    if (localStorage.getItem('blk_tour_pending') !== '1') return;
    if (!appEl || !appEl.classList.contains('active')) return;
    if (typeof currentUserId === 'undefined' || !currentUserId) return;
    localStorage.removeItem('blk_tour_pending');
    saveTour({ active: true, seen: {} });
    setTimeout(function () { showTip('pageHome'); }, 900);
  }
  var appEl0 = $('appContainer');
  if (appEl0) new MutationObserver(startTourIfPending).observe(appEl0, { attributes: true, attributeFilter: ['class'] });
  startTourIfPending();
  // Pour revoir le guide : ouvre le site avec #guide à la fin de l'adresse (ex. ...vercel.app/#guide)
  if (/guide/.test(location.hash + location.search)) {
    try { localStorage.setItem('blk_tour_pending', '1'); history.replaceState(null, '', location.pathname); } catch (e) {}
    startTourIfPending();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.tab-item');
    if (!t) return;
    var tab = t.dataset.tab;
    hideTip();
    setTimeout(function () { showTip(tab); }, 350);
  }, true);

  // =====================================================================
  // CONNEXION / INSCRIPTION : message pendant que le serveur se réveille
  // =====================================================================
  [['loginSubmitOnb', 'Se connecter', 'Connexion en cours…'], ['finalizeRegisterBtn', 'Valider', 'Création du compte…']].forEach(function (c) {
    var btn = $(c[0]); if (!btn) return;
    var timer = null;
    new MutationObserver(function () {
      clearTimeout(timer);
      if (btn.disabled) {
        btn.textContent = c[2];
        timer = setTimeout(function () { if (btn.disabled) btn.textContent = c[2] + ' (le serveur se réveille, patiente jusqu\'à 1 minute)'; }, 6000);
      } else { btn.textContent = c[1]; }
    }).observe(btn, { attributes: true, attributeFilter: ['disabled'] });
  });

  // =====================================================================
  // NOTIFICATIONS PUSH (messages reçus même application fermée)
  // =====================================================================
  function urlB64(b) {
    var pad = '='.repeat((4 - b.length % 4) % 4), raw = atob((b + pad).replace(/-/g, '+').replace(/_/g, '/')), a = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) a[i] = raw.charCodeAt(i);
    return a;
  }
  async function enablePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'denied') return 'denied';
    if (Notification.permission !== 'granted') {
      var perm = await Notification.requestPermission();
      if (perm !== 'granted') return 'denied';
    }
    try {
      var reg = await navigator.serviceWorker.ready;
      var kr = await apiFetch('/api/push/key').then(function (r) { return r.json(); });
      if (!kr || !kr.success) return 'server';
      var sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64(kr.publicKey) });
      var res = await apiFetch('/api/push/subscribe', { method: 'POST', body: JSON.stringify({ subscription: sub }) }).then(function (r) { return r.json(); });
      if (res && res.success) { try { localStorage.setItem('blk_push_endpoint', sub.endpoint); } catch (e) {} return 'ok'; }
      return 'server';
    } catch (e) { return 'error'; }
  }
  // Désabonnement à la déconnexion
  var lo = $('btnLogout');
  if (lo) {
    lo.addEventListener('click', function () {
      try {
        var ep = localStorage.getItem('blk_push_endpoint');
        if (ep && typeof authToken !== 'undefined' && authToken) {
          fetch(BACKEND_URL + '/api/push/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }, body: JSON.stringify({ endpoint: ep }), keepalive: true });
          localStorage.removeItem('blk_push_endpoint');
        }
      } catch (e) {}
    }, true);
  }
  // Activation automatique, sans bouton : la permission est demandée au premier toucher après la connexion
  var pushTries = 0;
  var pushTimer = setInterval(function () {
    pushTries++;
    if (pushTries > 150) { clearInterval(pushTimer); return; }
    if (typeof authToken !== 'undefined' && authToken && typeof currentUserId !== 'undefined' && currentUserId) {
      clearInterval(pushTimer);
      if (!('Notification' in window)) return;
      if (Notification.permission === 'granted') { enablePush(); }
      else if (Notification.permission === 'default' && (!ios || standalone)) {
        var askOnce = function () {
          document.removeEventListener('click', askOnce, true);
          enablePush();
        };
        document.addEventListener('click', askOnce, true);
      }
    }
  }, 2000);

  // Touche une notification : ouvre directement la discussion
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function (ev) {
      var d = ev.data || {};
      if (d.type === 'open-chat' && d.senderId && typeof openDiscussion === 'function') openDiscussion(d.senderId, d.senderName || 'Contact');
    });
  }
  (function openFromHash() {
    var m = location.hash.match(/chat=([^&]+)(?:&name=(.*))?/);
    if (!m) return;
    var id = decodeURIComponent(m[1]), nm = m[2] ? decodeURIComponent(m[2]) : 'Contact', tries = 0;
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    var t = setInterval(function () {
      tries++;
      if (typeof currentUserId !== 'undefined' && currentUserId && typeof openDiscussion === 'function') {
        clearInterval(t); setTimeout(function () { openDiscussion(id, nm); }, 800);
      } else if (tries > 40) clearInterval(t);
    }, 500);
  })();
})();
