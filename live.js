/* BLK - Lives v2 : défilement vidéo par vidéo (style TikTok) + libellé "Live" sous les boutons
   À charger APRÈS blk-features.js :  <script src="blk-live2.js"></script> */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function dots(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
  function loader(n, c) { return window.blkOrbit ? window.blkOrbit(n, 0, c || '#fff') : ''; }
  function noop() {}

  var CATS = { robes: 'Robes', hauts: 'Hauts', bas: 'Bas', chaussures: 'Chaussures', sacs: 'Sacs', perruques: 'Perruques', bijoux: 'Bijoux', cosmetiques: 'Cosmétiques', accessoires: 'Accessoires' };
  var QUARTIERS = {
    brazzaville: ['Makélékélé', 'Bacongo', 'Poto-Poto', 'Moungali', 'Ouenzé', 'Talangaï', 'Mfilou', 'Madibou', 'Djiri'],
    pointenoire: ['Lumumba', 'Mvou-Mvou', 'Tié-Tié', 'Loandjili', 'Mongo-Mpoukou', 'Ngoyo']
  };

  var st = document.createElement('style');
  st.textContent =
    /* libellé sous les boutons */
    '.blk-lw{display:flex;flex-direction:column;align-items:center;gap:3px;margin-left:auto;flex-shrink:0}' +
    '.blk-lw.nm{margin-left:0}.blk-lw .blk-livebtn{margin-left:0}' +
    '.blk-lw span.lb{font-size:11px;font-weight:800;color:var(--accent);line-height:1}' +
    /* flux vertical */
    '.bf{position:fixed;left:0;right:0;top:0;height:100%;z-index:2500;background:#000;color:#fff}' +
    '.bf-scroll{height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}' +
    '.bf-slide{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;background:#111 center/cover no-repeat;overflow:hidden}' +
    '.bf-slide::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.55)}' +
    '.bf-vid{position:absolute;inset:0}.bf-vid video{object-fit:cover!important}' +
    '.bf-msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:0 34px;font-size:14px;color:rgba(255,255,255,.9);pointer-events:none}' +
    '.bf-ui{position:absolute;inset:0;z-index:5;pointer-events:none}.bf-ui>*{pointer-events:auto}' +
    '.bf-top{position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 12px) 12px 30px;display:flex;align-items:center;gap:8px;background:linear-gradient(to bottom,rgba(0,0,0,.55),rgba(0,0,0,0))}' +
    '.bf-host{display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.4);border-radius:999px;padding:3px 12px 3px 3px;min-width:0;cursor:pointer}' +
    '.bf-host .av{width:34px;height:34px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0}' +
    '.bf-host .av img{width:100%!important;height:100%!important;aspect-ratio:auto!important;object-fit:cover}' +
    '.bf-host .nm{font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:34vw}' +
    '.bf-chip{background:#ff3b30;border-radius:8px;padding:5px 9px;font-size:11px;font-weight:900;letter-spacing:.6px}' +
    '.bf-eye{background:rgba(0,0,0,.45);border-radius:999px;padding:5px 10px;font-size:12px;font-weight:700}' +
    '.bf-x{margin-left:auto;background:rgba(0,0,0,.45);border:none;color:#fff;border-radius:50%;width:38px;height:38px;font-size:18px;cursor:pointer}' +
    '.bf-side{position:absolute;right:12px;bottom:calc(150px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:14px;align-items:center}' +
    '.bf-btn{position:relative;width:56px;height:56px;border-radius:50%;border:none;background:rgba(0,0,0,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;cursor:pointer}' +
    '.bf-btn svg{width:24px;height:24px}' +
    '.bf-btn .n{position:absolute;top:-3px;right:-3px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#ff3b30;font-size:11px;display:none;align-items:center;justify-content:center}' +
    '.bf-comments{position:absolute;left:0;right:76px;bottom:calc(66px + env(safe-area-inset-bottom,0px));max-height:34%;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:0 12px;pointer-events:none!important;-webkit-mask-image:linear-gradient(to bottom,transparent,#000 35%);mask-image:linear-gradient(to bottom,transparent,#000 35%)}' +
    '.bf-c{font-size:14px;line-height:1.35;margin-top:5px;text-shadow:0 1px 4px rgba(0,0,0,.8);word-break:break-word}.bf-c b{margin-right:6px;color:#ffd9a8}.bf-c.sys{color:#9fffb4;font-style:italic}' +
    '.bf-bottom{position:absolute;left:0;right:0;bottom:0;padding:8px 12px calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:8px;align-items:center;background:linear-gradient(to top,rgba(0,0,0,.6),rgba(0,0,0,0))}' +
    '.bf-bottom input{flex:1;min-width:0;padding:12px 16px;border-radius:999px;border:1.5px solid rgba(255,255,255,.4);background:rgba(0,0,0,.35);color:#fff;font-size:16px;outline:none}.bf-bottom input::placeholder{color:rgba(255,255,255,.7)}' +
    '.bf-send{border:none;background:var(--accent);color:#fff;border-radius:999px;padding:12px 16px;font-weight:800;font-size:14px;cursor:pointer}' +
    '.bf-swipe{position:absolute;left:0;right:0;bottom:calc(112px + env(safe-area-inset-bottom,0px));text-align:center;font-size:12px;color:rgba(255,255,255,.85);pointer-events:none!important;animation:bfUp 1.4s ease-in-out infinite;transition:opacity .5s}' +
    '@keyframes bfUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
    '.bf-end{position:absolute;inset:0;z-index:8;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:30px}' +
    '.bf-fly{position:absolute;right:26px;bottom:200px;pointer-events:none;z-index:7;animation:bfFly 1.8s ease-out forwards}' +
    '@keyframes bfFly{0%{transform:translate(0,0) scale(.6);opacity:1}100%{transform:translate(var(--dx,0),-260px) scale(1.2);opacity:0}}' +
    '.bf-item{display:flex;align-items:center;gap:12px;background:var(--input-bg);border-radius:16px;padding:13px;margin-bottom:8px}' +
    '.bf-item .t{flex:1;min-width:0}.bf-item .t b{display:block;font-size:15px}.bf-item .t span{font-size:12px;color:#999}.bf-item .p{font-weight:900;color:var(--accent);white-space:nowrap}' +
    '.bf-res{border:none;background:var(--accent);color:#fff;border-radius:999px;padding:10px 16px;font-weight:800;font-size:13px;cursor:pointer}' +
    '.bf-taken{font-size:12px;font-weight:800;color:#999;background:var(--card-bg);border-radius:999px;padding:8px 12px;white-space:nowrap}';
  document.head.appendChild(st);

  // ------------------------------------------------------------ Agora
  var URLS = ['https://download.agora.io/sdk/release/AgoraRTC_N-4.24.8.js', 'https://unpkg.com/agora-rtc-sdk-ng@4.24.8/AgoraRTC_N-production.js'];
  var agoraP = null;
  function loadAgora() {
    if (window.AgoraRTC) return Promise.resolve();
    if (agoraP) return agoraP;
    agoraP = new Promise(function (res, rej) {
      var i = 0;
      (function next() {
        if (i >= URLS.length) { agoraP = null; return rej(new Error('SDK_INDISPONIBLE')); }
        var s = document.createElement('script'); s.src = URLS[i++];
        s.onload = function () { window.AgoraRTC ? res() : next(); }; s.onerror = next; document.head.appendChild(s);
      })();
    });
    return agoraP;
  }

  // ------------------------------------------------------------ flux
  var F = null;
  var ICON_BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

  function slideHtml(l) {
    var bg = l.coverUrl || l.sellerPhoto || '';
    return '<div class="bf-vid"></div><div class="bf-msg"></div>';
  }
  function addSlide(l) {
    var s = document.createElement('section'); s.className = 'bf-slide'; s.dataset.id = l.id;
    var bg = l.coverUrl || l.sellerPhoto || '';
    if (bg) s.style.backgroundImage = 'url("' + String(bg).replace(/"/g, '%22') + '")';
    s.innerHTML = slideHtml(l);
    $('.bf-scroll', F.el).appendChild(s);
    F.slides.push(s);
  }
  function msg(i, html) { var s = F && F.slides[i]; if (!s) return; var m = $('.bf-msg', s); m.innerHTML = html || ''; }
  function fit() {
    if (!F) return;
    var vv = window.visualViewport;
    if (vv) { F.el.style.top = vv.offsetTop + 'px'; F.el.style.height = vv.height + 'px'; }
    var sc = $('.bf-scroll', F.el); if (sc && F.idx >= 0) sc.scrollTop = F.idx * sc.clientHeight;
  }
  if (window.visualViewport) { visualViewport.addEventListener('resize', fit); visualViewport.addEventListener('scroll', fit); }

  function buildUI() {
    var el = document.createElement('div'); el.className = 'bf'; el.id = 'blkFeed';
    el.innerHTML =
      '<div class="bf-scroll"></div>' +
      '<div class="bf-ui">' +
        '<div class="bf-top"><div class="bf-host" id="bfHost"><span class="av" id="bfAv"></span><span class="nm" id="bfNm"></span></div>' +
          '<span class="bf-chip">EN DIRECT</span><span class="bf-eye" id="bfEye">0</span><button class="bf-x" id="bfClose" aria-label="Fermer">✕</button></div>' +
        '<div class="bf-side">' +
          '<button class="bf-btn" id="bfBag">' + ICON_BAG + '<span>Articles</span><span class="n" id="bfBagN"></span></button>' +
          '<button class="bf-btn" id="bfFlame"><span id="bfFlameImg"></span><span id="bfFlameN">0</span></button></div>' +
        '<div class="bf-comments" id="bfComments"></div>' +
        '<div class="bf-swipe" id="bfSwipe" style="display:none">⌃<br>Glisse vers le haut pour le live suivant</div>' +
        '<div class="bf-bottom"><input id="bfInput" type="text" maxlength="200" placeholder="Écris un commentaire…" autocomplete="off"><button class="bf-send" id="bfSend">Envoyer</button></div>' +
      '</div>';
    document.body.appendChild(el);
    document.body.classList.add('blk-live-open');
    $('#bfFlameImg', el).innerHTML = window.blkFlameImg ? window.blkFlameImg(0, true) : '🔥';
    return el;
  }

  function openFeed(startId) {
    if (F || document.getElementById('blkLive')) return;
    if (typeof showSpinner === 'function') showSpinner(true);
    apiFetch('/api/lives').then(function (r) { return r.json(); }).then(function (d) {
      if (typeof showSpinner === 'function') showSpinner(false);
      var me = (typeof currentUserId !== 'undefined') ? currentUserId : null;
      var list = ((d && d.data) || []).filter(function (l) { return l.sellerId !== me; });
      if (!list.length) { showAlert('Aucun live en ce moment. Reviens plus tard !', 'info'); return; }
      start(list, startId);
    }).catch(function () { if (typeof showSpinner === 'function') showSpinner(false); showAlert('Erreur réseau.', 'error'); });
  }

  function start(list, startId) {
    F = { el: buildUI(), lives: [], slides: [], idx: -1, gen: 0, chain: Promise.resolve(), client: null, since: 0, flames: 0, items: [], itemSig: '', pollT: null, listT: null, seenSwipe: false };
    list.forEach(function (l) { F.lives.push(l); addSlide(l); });
    var sc = $('.bf-scroll', F.el), first = 0;
    if (startId) list.forEach(function (l, i) { if (l.id === startId) first = i; });
    fit();
    sc.scrollTop = first * sc.clientHeight;
    var tm = null;
    sc.addEventListener('scroll', function () {
      clearTimeout(tm);
      tm = setTimeout(function () {
        if (!F) return;
        var i = Math.round(sc.scrollTop / sc.clientHeight);
        if (i !== F.idx) switchTo(i);
      }, 140);
    }, { passive: true });
    wire();
    switchTo(first);
    F.listT = setInterval(refreshList, 12000);
  }

  function refreshList() {
    if (!F) return;
    apiFetch('/api/lives').then(function (r) { return r.json(); }).then(function (d) {
      if (!F) return;
      var me = (typeof currentUserId !== 'undefined') ? currentUserId : null;
      ((d && d.data) || []).forEach(function (l) {
        if (l.sellerId === me) return;
        if (!F.lives.some(function (x) { return x.id === l.id; })) { F.lives.push(l); addSlide(l); }
      });
    }).catch(noop);
  }

  function leave() {
    var c = F && F.client; if (!c) return Promise.resolve();
    try { return Promise.resolve(c.leave()).catch(noop); } catch (e) { return Promise.resolve(); }
  }

  function switchTo(i) {
    if (!F || i < 0 || i >= F.lives.length) return;
    var gen = ++F.gen; F.idx = i;
    var l = F.lives[i];
    // remise à zéro de l'écran partagé
    F.since = 0; F.flames = 0; F.items = []; F.itemSig = '';
    var cm = $('#bfComments'); if (cm) cm.innerHTML = '';
    $('#bfFlameN').textContent = '0'; $('#bfEye').textContent = '0'; $('#bfBagN').style.display = 'none';
    var nm = l.sellerName || 'Vendeur';
    $('#bfNm').textContent = nm;
    $('#bfAv').innerHTML = l.sellerPhoto ? safeImgTag(l.sellerPhoto, nm, 'width:100%;height:100%;object-fit:cover;') : escapeHtml(nm.charAt(0).toUpperCase());
    F.slides.forEach(function (s, k) { if (k !== i) { var v = $('.bf-vid', s); if (v) v.innerHTML = ''; var m = $('.bf-msg', s); if (m) m.innerHTML = ''; } });
    var old = $('.bf-end', F.el); if (old) old.remove();
    msg(i, loader(44) + '<span>Connexion au live…</span>');
    clearInterval(F.pollT); F.pollT = null;

    // hint de défilement (une seule fois)
    var sw = $('#bfSwipe');
    if (sw && !F.seenSwipe && F.lives.length > 1) { F.seenSwipe = true; sw.style.display = 'block'; setTimeout(function () { sw.style.opacity = 0; setTimeout(function () { sw.style.display = 'none'; }, 600); }, 4500); }

    F.chain = F.chain.then(function () { if (!F || gen !== F.gen) return; return connect(i, gen); }).catch(noop);
  }

  function connect(i, gen) {
    var l = F.lives[i];
    return leave().then(function () {
      if (!F || gen !== F.gen) return;
      return apiFetch('/api/lives/' + l.id + '/token', { method: 'POST', body: '{}' }).then(function (r) { return r.json(); });
    }).then(function (d) {
      if (!F || gen !== F.gen || !d) return;
      if (!d.success) { liveEnded(i, d.message); return; }
      return loadAgora().then(function () {
        if (!F || gen !== F.gen) return;
        if (!F.client) {
          F.client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
          F.client.on('user-published', function (user, mt) {
            F.client.subscribe(user, mt).then(function () {
              if (!F) return;
              if (mt === 'video') { var s = F.slides[F.idx]; if (s) { msg(F.idx, ''); user.videoTrack.play($('.bf-vid', s)); } }
              if (mt === 'audio') user.audioTrack.play();
            }).catch(noop);
          });
          F.client.on('user-unpublished', function (user, mt) { if (F && mt === 'video') msg(F.idx, '<span>Le vendeur a coupé sa caméra…</span>'); });
        }
        var a = d.agora;
        return F.client.setClientRole('audience', { level: 1 }).then(function () { return F.client.join(a.appId, a.channel, a.token, a.uid); }).then(function () {
          if (!F || gen !== F.gen) return;
          (F.client.remoteUsers || []).forEach(function (u) {
            if (u.hasVideo) F.client.subscribe(u, 'video').then(function () { var s = F && F.slides[F.idx]; if (s) { msg(F.idx, ''); u.videoTrack.play($('.bf-vid', s)); } }).catch(noop);
            if (u.hasAudio) F.client.subscribe(u, 'audio').then(function () { u.audioTrack.play(); }).catch(noop);
          });
          setTimeout(function () { if (F && gen === F.gen && $('.bf-msg', F.slides[i]).innerHTML.indexOf('Connexion') > -1) msg(i, '<span>En attente de la vidéo du vendeur…</span>'); }, 4000);
          F.pollT = setInterval(poll, 2000); poll();
        });
      });
    }).catch(function (e) {
      if (!F || gen !== F.gen) return;
      console.error('live feed:', e);
      var m = String((e && (e.message || e.code)) || '');
      msg(i, '<span>' + (/SDK_INDISPONIBLE/.test(m) ? 'Impossible de charger la vidéo. Vérifie ta connexion.' : 'Connexion au live impossible. Glisse vers le haut ou réessaie plus tard.') + '</span>');
    });
  }

  function liveEnded(i, text) {
    if (!F || F.over === F.gen) return;
    F.over = F.gen;
    clearInterval(F.pollT); F.pollT = null;
    var s = F.slides[i]; if (!s) return;
    var more = F.idx < F.lives.length - 1;
    var d = document.createElement('div'); d.className = 'bf-end';
    d.innerHTML = '<div style="font-size:20px;font-weight:900;">Le live est terminé</div><div style="font-size:14px;opacity:.85;max-width:300px;">' +
      (text || 'Si tu as réservé un article, le chrono de 6 h démarre maintenant : retrouve-le dans « Commandes ».') + '</div>' +
      '<button class="btn btn-primary" id="bfNext" style="width:auto;padding:12px 28px;">' + (more ? 'Live suivant' : 'Fermer') + '</button>';
    F.el.appendChild(d);
    $('#bfNext', d).addEventListener('click', function () {
      if (more) { var sc = $('.bf-scroll', F.el); sc.scrollTo({ top: (F.idx + 1) * sc.clientHeight, behavior: 'smooth' }); d.remove(); }
      else close();
    });
    try { loadWallet(); loadOrders(); } catch (e) {}
  }

  function addComments(list) {
    var box = $('#bfComments'); if (!box || !list.length) return;
    list.forEach(function (c) {
      var d = document.createElement('div'); d.className = 'bf-c' + (c.system ? ' sys' : '');
      d.innerHTML = c.system ? escapeHtml(c.text) : '<b>' + escapeHtml((c.name || '').split(' ')[0]) + '</b>' + escapeHtml(c.text);
      box.appendChild(d);
    });
    while (box.children.length > 40) box.removeChild(box.firstChild);
  }
  function fly(n) {
    if (!F) return;
    for (var i = 0; i < Math.min(n, 5); i++) {
      (function (k) { setTimeout(function () {
        if (!F) return;
        var f = document.createElement('div'); f.className = 'bf-fly'; f.style.setProperty('--dx', (Math.random() * 60 - 40) + 'px');
        f.innerHTML = window.blkFlameImg ? window.blkFlameImg(0) : '🔥'; F.el.appendChild(f); setTimeout(function () { f.remove(); }, 1900);
      }, k * 140); })(i);
    }
  }

  function poll() {
    if (!F) return;
    var gen = F.gen, l = F.lives[F.idx]; if (!l) return;
    apiFetch('/api/lives/' + l.id + '/state?since=' + F.since).then(function (r) { return r.json(); }).then(function (d) {
      if (!F || gen !== F.gen) return;
      if (!d.success || d.status === 'ended') return liveEnded(F.idx);
      F.since = d.seq;
      $('#bfEye').textContent = d.viewers + ' en direct';
      if (d.flames > F.flames) fly(d.flames - F.flames);
      F.flames = d.flames; $('#bfFlameN').textContent = d.flames;
      addComments(d.comments || []);
      F.items = d.items || [];
      var av = F.items.filter(function (x) { return x.status === 'available'; }).length, bn = $('#bfBagN');
      bn.textContent = av; bn.style.display = av ? 'flex' : 'none';
      if (F.sheet && F.sheet.isConnected) renderSheet();
    }).catch(noop);
  }

  function close() {
    if (!F) return;
    var f = F; F = null;
    clearInterval(f.pollT); clearInterval(f.listT);
    try { if (f.client) f.client.leave(); } catch (e) {}
    f.el.remove();
    var e2 = $('.bf-end'); if (e2) e2.remove();
    document.body.classList.remove('blk-live-open');
  }

  // ------------------------------------------------------------ interactions
  function sheet(html) {
    var ov = document.createElement('div'); ov.className = 'blk-sheet-ov'; ov.style.zIndex = 9800;
    ov.innerHTML = '<div class="blk-sheet">' + html + '</div>'; document.body.appendChild(ov);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    return ov;
  }
  function renderSheet() {
    var box = $('#bfList', F.sheet); if (!box) return;
    var sig = JSON.stringify(F.items.map(function (i) { return [i.id, i.status]; }));
    if (F.itemSig === sig) return; F.itemSig = sig;
    if (!F.items.length) { box.innerHTML = '<p class="empty">Aucun article pour le moment.</p>'; return; }
    box.innerHTML = '';
    F.items.forEach(function (it) {
      var row = document.createElement('div'); row.className = 'bf-item';
      var right = it.status === 'available' ? '<button class="bf-res">Réserver</button>' : '<span class="bf-taken">Réservé' + (it.reservedBy ? ' · ' + escapeHtml(it.reservedBy) : '') + '</span>';
      row.innerHTML = '<div class="t"><b>' + escapeHtml(it.name) + '</b><span>' + escapeHtml(CATS[it.category] || it.category || '') + '</span></div><div class="p">' + dots(it.price) + ' FCFA</div>' + right;
      var b = $('.bf-res', row); if (b) b.addEventListener('click', function () { openReserve(it); });
      box.appendChild(row);
    });
  }
  function openBag() {
    F.itemSig = '';
    F.sheet = sheet('<div class="blk-sheet-h"><strong>Articles du live</strong><button class="blk-x" id="bgX">✕</button></div><div id="bfList"></div>');
    $('#bgX', F.sheet).addEventListener('click', function () { F.sheet.remove(); });
    renderSheet();
  }

  function openReserve(it) {
    if (!F) return;
    var liveId = F.lives[F.idx].id;
    var u = (typeof currentUser !== 'undefined' && currentUser) || {}, Q = QUARTIERS[norm(u.city)];
    var fee = Math.round(it.price * 0.03), total = it.price + fee;
    var help = Q ? 'Choisis ton arrondissement, puis écris un repère précis (arrêt, école, marché, église…) pour que le vendeur te trouve.'
      : 'Écris ton quartier et un repère précis (rue, école, marché…) pour que le vendeur te trouve' + (u.city ? ' à ' + escapeHtml(u.city) : '') + '.';
    var ov = sheet('<div class="blk-sheet-h"><strong>Réserver</strong><button class="blk-x" id="rsX">✕</button></div>' +
      '<div style="background:var(--input-bg);border-radius:16px;padding:12px 14px;margin-bottom:12px;"><b>' + escapeHtml(it.name) + '</b>' +
        '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:14px;"><span>Prix</span><span>' + dots(it.price) + ' FCFA</span></div>' +
        '<div style="display:flex;justify-content:space-between;font-size:14px;"><span>Commission BLK (3%)</span><span>' + dots(fee) + ' FCFA</span></div>' +
        '<div style="display:flex;justify-content:space-between;font-weight:900;margin-top:4px;"><span>Total</span><span style="color:var(--accent);">' + dots(total) + ' FCFA</span></div></div>' +
      (Q ? '<select id="rsQ"><option value="">Mon arrondissement</option>' + Q.map(function (q) { return '<option>' + q + '</option>'; }).join('') + '</select>' : '<input class="fld" id="rsQ" type="text" maxlength="80" placeholder="Mon quartier" autocomplete="off">') +
      '<textarea id="rsD" rows="2" maxlength="200" placeholder="Repère précis, numéro de téléphone pour te joindre…"></textarea>' +
      '<p class="note">' + help + '</p>' +
      '<input class="fld" id="rsPin" type="password" inputmode="numeric" maxlength="6" placeholder="Code secret (6 chiffres)" autocomplete="off">' +
      '<p class="note">Le paiement est pris sur ton Wallet BLK et gardé par l’application. À la fin du live, le chrono de 6 h démarre. Si tu ne reçois pas ton article, tu es remboursé.</p>' +
      '<div class="err" id="rsErr"></div><button class="btn btn-primary" id="rsGo">Réserver et payer</button>');
    $('#rsX', ov).addEventListener('click', function () { ov.remove(); });
    $('#rsPin', ov).addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 6); });
    $('#rsGo', ov).addEventListener('click', function () {
      var q = $('#rsQ', ov).value.trim(), d = $('#rsD', ov).value.trim(), pin = $('#rsPin', ov).value, err = $('#rsErr', ov);
      if (!q) { err.textContent = 'Indique ton quartier.'; return; }
      if (pin.length !== 6) { err.textContent = 'Entre ton code secret à 6 chiffres.'; return; }
      err.style.color = '#999'; err.textContent = 'Réservation…';
      apiFetch('/api/lives/' + liveId + '/items/' + it.id + '/reserve', { method: 'POST', body: JSON.stringify({ quartier: q, details: d, pin: pin }) })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (r.success) { ov.remove(); if (F && F.sheet) F.sheet.remove(); showAlert(r.message || 'Réservé !', 'success'); try { loadWallet(); } catch (e) {} poll(); }
          else { err.style.color = '#E74C3C'; err.textContent = r.message || 'Erreur, réessaie.'; if (/insuffisant/i.test(r.message || '')) err.textContent += ' Ajoute de l’argent dans ton Wallet (Profil, Déposer).'; poll(); }
        }).catch(function () { err.style.color = '#E74C3C'; err.textContent = 'Erreur réseau.'; });
    });
  }

  function wire() {
    $('#bfClose').addEventListener('click', close);
    $('#bfBag').addEventListener('click', openBag);
    $('#bfHost').addEventListener('click', function () {
      if (!F || !window.blkShowSellerProfile) return;
      var l = F.lives[F.idx];
      window.blkShowSellerProfile(l.sellerId, l.sellerName || 'Vendeur');
      var p = document.getElementById('blkSP'); if (p) p.style.zIndex = 9600;   // au-dessus du live
    });
    function send() {
      var i = $('#bfInput'), t = i.value.trim(); if (!t || !F) return; i.value = '';
      apiFetch('/api/lives/' + F.lives[F.idx].id + '/comment', { method: 'POST', body: JSON.stringify({ text: t }) }).then(poll).catch(noop);
    }
    $('#bfSend').addEventListener('click', send);
    $('#bfInput').addEventListener('keypress', function (e) { if (e.key === 'Enter') send(); });
    $('#bfInput').addEventListener('focus', function () { [60, 250, 600].forEach(function (t) { setTimeout(function () { window.scrollTo(0, 0); fit(); }, t); }); });
    $('#bfFlame').addEventListener('click', function () {
      if (!F) return; fly(1);
      apiFetch('/api/lives/' + F.lives[F.idx].id + '/flame', { method: 'POST', body: '{}' }).catch(noop);
    });
  }

  // ------------------------------------------------------------ libellé "Live" + remplacement du bouton
  function decorate() {
    var b = document.getElementById('blkLiveBtn');
    if (b && !b.dataset.l2) {
      var nb = b.cloneNode(true); nb.dataset.l2 = '1';   // le clone n'a plus l'ancien comportement
      var w = document.createElement('div'); w.className = 'blk-lw';
      b.parentNode.replaceChild(w, b); w.appendChild(nb);
      w.insertAdjacentHTML('beforeend', '<span class="lb">Live</span>');
      nb.addEventListener('click', function () { openFeed(); });
    }
    var s = document.getElementById('blkStartLive');
    if (s && !s.dataset.l2) {
      s.dataset.l2 = '1';
      var w2 = document.createElement('div'); w2.className = 'blk-lw nm';
      s.parentNode.insertBefore(w2, s); w2.appendChild(s);
      w2.insertAdjacentHTML('beforeend', '<span class="lb">Live</span>');
    }
  }
  var pend = false;
  new MutationObserver(function () { if (!pend) { pend = true; requestAnimationFrame(function () { pend = false; try { decorate(); } catch (e) {} }); } })
    .observe(document.body, { childList: true, subtree: true });
  decorate();
  window.blkWatchLive = function (id) { openFeed(id); };
})();
