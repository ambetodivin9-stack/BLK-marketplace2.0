(function () {
  if (window.__blkExtras) return; window.__blkExtras = true;

  // ---------- Styles ----------
  var st = document.createElement('style');
  st.textContent =
    '#ptr{position:fixed;top:-50px;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:var(--card-bg);box-shadow:0 4px 14px var(--shadow);display:flex;align-items:center;justify-content:center;z-index:3000;color:var(--accent);font-size:20px;transition:top .25s;}' +
    '#ptr.spin{animation:spin .8s linear infinite;}' +
    '#installBanner{position:fixed;left:12px;right:12px;bottom:92px;max-width:576px;margin:0 auto;background:var(--card-bg);border:2px solid var(--accent);border-radius:18px;padding:12px 14px;display:flex;align-items:center;gap:10px;z-index:1200;box-shadow:0 10px 30px var(--shadow);}' +
    '#installBanner img{width:42px;height:42px;border-radius:10px;}' +
    '#installBanner .t{flex:1;font-size:13px;font-weight:700;line-height:1.3;}' +
    '#installBanner button{border:none;border-radius:12px;padding:9px 14px;font-weight:800;font-size:13px;cursor:pointer;background:var(--accent);color:#fff;}' +
    '#installBanner button.x{background:transparent;color:#999;padding:6px;font-size:16px;}';
  document.head.appendChild(st);

  // ---------- Upload avec réessais ----------
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

  // ---------- Photo obligatoire ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#pubSubmit');
    if (!b) return;
    if (!document.querySelector('#publishPhotos .publish-thumb')) {
      e.stopImmediatePropagation(); e.preventDefault();
      var s = document.getElementById('pubStatus');
      if (s) { s.style.color = '#E74C3C'; s.textContent = 'Ajoute au moins une photo.'; }
    }
  }, true);

  // ---------- Glisser vers le bas pour actualiser ----------
  var ptr = document.getElementById('ptr');
  if (!ptr) { ptr = document.createElement('div'); ptr.id = 'ptr'; ptr.textContent = '↓'; document.body.appendChild(ptr); }
  var startY = 0, pulling = false, dist = 0, busy = false;
  function blocked() { return document.querySelector('.chat-fullscreen.active, .modal-overlay.active, .warning-fullscreen.active, .onboard-screen.active'); }
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

  // ---------- Bannière « Installer l'application » ----------
  var deferred = null;
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  function hidden() { return parseInt(localStorage.getItem('blk_install_hide') || '0', 10) > Date.now(); }
  function showBanner() {
    if (standalone || hidden() || document.getElementById('installBanner')) return;
    var d = document.createElement('div'); d.id = 'installBanner';
    d.innerHTML = '<img src="icon-192.png" alt="BLK"><div class="t">Installe BLK Marketplace sur ton téléphone</div><button id="ibInstall">Installer</button><button class="x" id="ibClose">✕</button>';
    document.body.appendChild(d);
    document.getElementById('ibClose').onclick = function () {
      localStorage.setItem('blk_install_hide', String(Date.now() + 3 * 86400000)); d.remove();
    };
    document.getElementById('ibInstall').onclick = function () {
      if (deferred) { deferred.prompt(); deferred = null; d.remove(); }
      else { var b = document.getElementById('btnInstallApp'); if (b) b.click(); }
    };
  }
  window.addEventListener('beforeinstallprompt', function (e) { deferred = e; setTimeout(showBanner, 2500); });
  window.addEventListener('appinstalled', function () { var b = document.getElementById('installBanner'); if (b) b.remove(); });
  if (ios && !standalone) setTimeout(showBanner, 3000);
})();
