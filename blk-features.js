/* BLKmarketplace - fonctions ajoutées (v1)
   Chargé à la fin de index.html : <script src="blk-features.js"></script> */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
  function me() { try { return currentUser || {}; } catch (e) { return {}; } }

  // Pays où MTN et Airtel Money sont utilisés (modifie cette liste si besoin)
  var CITIES = {
    "République du Congo": ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Oyo", "Owando", "Ouesso"],
    "RDC": ["Kinshasa", "Lubumbashi", "Goma", "Kisangani", "Mbuji-Mayi", "Bukavu"],
    "Ouganda": ["Kampala", "Entebbe", "Jinja", "Gulu"],
    "Rwanda": ["Kigali", "Huye", "Musanze"],
    "Zambie": ["Lusaka", "Ndola", "Kitwe", "Livingstone"],
    "Ghana": ["Accra", "Kumasi", "Tamale", "Takoradi"],
    "Nigeria": ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"]
  };
  var COUNTRIES = Object.keys(CITIES);
  function countryOptions(sel) {
    return '<option value="">Pays</option>' + COUNTRIES.map(function (c) { return '<option' + (c === sel ? ' selected' : '') + '>' + c + '</option>'; }).join('');
  }
  function bindCities(selEl, inputEl, listId) {
    var dl = document.getElementById(listId);
    if (!dl) { dl = document.createElement('datalist'); dl.id = listId; document.body.appendChild(dl); }
    inputEl.setAttribute('list', listId);
    function fill() { dl.innerHTML = (CITIES[selEl.value] || []).map(function (c) { return '<option value="' + c + '">'; }).join(''); }
    selEl.addEventListener('change', fill); fill();
  }

  // ---------------------------------------------------------------- CSS
  var kf = '';
  for (var p = 0; p <= 100; p += 5) {
    var a = 2 * Math.PI * p / 100;
    kf += p + '%{transform:translate(calc(var(--sz)*' + (0.5 * Math.cos(a)).toFixed(3) + ')) scale(' + (0.73684 - 0.26316 * Math.sin(a)).toFixed(3) + ');opacity:' + (0.65 - 0.35 * Math.sin(a)).toFixed(3) + '}';
  }
  var css = '@keyframes blkOrbit{' + kf + '}' +
  '@keyframes blkRot{to{transform:rotate(360deg)}}' +
  '.blk-orbit{--sz:45px;--spd:1.75s;--c:#fff;position:relative;width:var(--sz);height:var(--sz);animation:blkRot calc(var(--spd)*4) linear infinite}' +
  '.blk-orbit .p{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}' +
  '.blk-orbit .p::before{content:"";position:absolute;border-radius:50%;background:var(--c);width:var(--dot,17.5%);height:var(--dot,17.5%);animation:blkOrbit var(--spd) linear calc(var(--dly)*var(--spd)) infinite}' +
  '#spinnerOverlay .spinner{display:none}' +
  /* écran de démarrage */
  '#blkIntro{position:fixed;inset:0;z-index:100000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;overflow:hidden;background:linear-gradient(160deg,#FF9A3C 0%,#E74C3C 65%,#C0392B 100%);transition:opacity .7s ease}' +
  '#blkIntro.out{opacity:0;pointer-events:none}' +
  '.bi-glow{position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.28),rgba(255,255,255,0) 65%);animation:biGlow 4s ease-in-out infinite}' +
  '@keyframes biGlow{0%,100%{transform:scale(.85);opacity:.7}50%{transform:scale(1.15);opacity:1}}' +
  '.bi-logo{position:relative;width:200px;height:200px;display:flex;align-items:center;justify-content:center;transition:transform 1s cubic-bezier(.22,1,.36,1),margin .9s ease}' +
  '#blkIntro.s2 .bi-logo{transform:scale(.62);margin:-34px 0 -34px}' +
  '.bi-orbit{position:absolute;inset:5px;display:flex;align-items:center;justify-content:center}' +
  '.bi-card{width:112px;height:112px;border-radius:28px;overflow:hidden;background:#fff;box-shadow:0 14px 34px rgba(0,0,0,.28);animation:biPop 1.4s cubic-bezier(.22,1,.36,1)}' +
  '.bi-card img{width:100%;height:100%;object-fit:cover;display:block}' +
  '@keyframes biPop{0%{opacity:0;transform:scale(.2) rotate(-18deg)}50%{opacity:1;transform:scale(1.14) rotate(4deg)}75%{transform:scale(.96)}100%{transform:scale(1) rotate(0)}}' +
  '.bi-name{position:relative;z-index:2;display:flex;color:#fff;font-size:34px;font-weight:900;letter-spacing:.5px;margin-top:6px;text-shadow:0 3px 14px rgba(0,0,0,.25)}' +
  '.bi-name .l{opacity:0;transform:translateY(16px)}.bi-name .l.m{font-weight:500}' +
  '#blkIntro.s2 .bi-name .l{animation:biLetter .6s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(var(--i)*85ms)}' +
  '@keyframes biLetter{to{opacity:1;transform:translateY(0)}}' +
  '.bi-bar{height:4px;width:0;border-radius:4px;margin-top:14px;background:linear-gradient(90deg,#fff,#FFE0B2,#2ECC71,#fff);transition:width 1.6s ease .9s}' +
  '#blkIntro.s2 .bi-bar{width:150px}' +
  '.bi-text{position:relative;z-index:2;max-width:330px;text-align:center;color:rgba(255,255,255,.95);font-size:15.5px;line-height:1.65;margin-top:22px;min-height:150px}' +
  '.bi-text .w{display:inline-block;opacity:0;transform:translateY(8px);margin:0 2px}' +
  '.bi-text.on .w{animation:biWord .55s ease forwards;animation-delay:calc(var(--i)*95ms)}' +
  '@keyframes biWord{to{opacity:1;transform:translateY(0)}}' +
  '.bi-progress{position:absolute;left:0;right:0;bottom:0;height:5px;background:rgba(255,255,255,.2)}' +
  '.bi-progress i{display:block;height:100%;width:0;background:#fff;animation:biProg 11s linear forwards}' +
  '@keyframes biProg{to{width:100%}}' +
  /* flammes */
  '.blk-flame{display:inline-block;vertical-align:middle;transform-origin:50% 90%;animation:blkFlame var(--fd,1.4s) ease-in-out infinite;background:transparent}' +
  '@keyframes blkFlame{0%{transform:scale(1) rotate(-2deg)}25%{transform:scale(1.07,1.13) rotate(2deg) translateY(-1px)}50%{transform:scale(.96,1.04) rotate(-1deg)}75%{transform:scale(1.1,1.07) rotate(3deg)}100%{transform:scale(1) rotate(-2deg)}}' +
  '.blk-flame-label{display:inline-flex!important;align-items:flex-end;gap:3px;vertical-align:middle;margin-left:4px}.blk-flame-label .blk-info{font-size:12px;color:#999;margin-bottom:2px}' +
  '#profileFlamesNew{animation:none!important;text-shadow:none!important}' +
  '.article-card{position:relative}' +
  '.blk-card-flame{position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:3px;background:rgba(255,255,255,.93);border-radius:999px;padding:2px 9px 2px 5px;font-size:11px;font-weight:800;color:#222;box-shadow:0 2px 8px rgba(0,0,0,.2)}' +
  /* images des fenêtres (colis / connexion) */
  '.blk-modal-art{display:block;margin:-4px auto 8px;width:58%;max-width:220px;height:auto;background:transparent;pointer-events:none;user-select:none;-webkit-user-select:none;filter:drop-shadow(0 12px 14px rgba(0,0,0,.18));animation:blkArtIn .8s cubic-bezier(.34,1.56,.64,1),blkFloat 3.4s ease-in-out .8s infinite}' +
  '@keyframes blkArtIn{0%{opacity:0;transform:scale(.4) translateY(20px)}100%{opacity:1;transform:scale(1)}}' +
  '@keyframes blkFloat{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-9px) rotate(1.5deg)}}' +
  /* choix pays / proximité */
  '.blk-scope{display:flex;gap:8px;margin-bottom:10px}.blk-chip{border:1.5px solid var(--accent);background:transparent;color:var(--accent);font-weight:700;font-size:12.5px;padding:7px 14px;border-radius:999px;cursor:pointer}.blk-chip.on{background:var(--accent);color:#fff}' +
  /* inscription : champs plus hauts pour le clavier */
  '.onboard-screen{overflow-y:auto;-webkit-overflow-scrolling:touch}.onboard-screen .wave-bg{position:fixed}' +
  '.onboard-content{min-height:100%;padding-bottom:calc(30px + var(--kb,0px))}' +
  '.onboard-content>div[style*="justify-content:center"]{justify-content:flex-start!important;padding-top:5vh}' +
  '.onboard-input-group select option{color:#222}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------------------------------------------------------------- Orbite (nouveau chargement)
  var ROT = [8, 36, 72, 90, 144, 180, 216, 252, 300, 324, 335, 290, 240];
  var DLY = [0, -0.4, -0.9, -0.5, -0.3, -0.2, -0.6, -0.7, -0.1, -0.8, -1.2, -0.5, -0.2];
  function orbit(size, dot, color) {
    var h = '<div class="blk-orbit" style="--sz:' + size + 'px;' + (dot ? '--dot:' + dot + 'px;' : '') + (color ? '--c:' + color : '') + '">';
    for (var i = 0; i < 13; i++) h += '<div class="p" style="transform:rotate(' + ROT[i] + 'deg);--dly:' + DLY[i] + '"></div>';
    return h + '</div>';
  }
  var so = $('#spinnerOverlay'); if (so) so.innerHTML = orbit(56, 0, '#fff');

  // ---------------------------------------------------------------- Nom de l'application
  var mt = $('meta[name="apple-mobile-web-app-title"]');
  if (!mt) { mt = document.createElement('meta'); mt.name = 'apple-mobile-web-app-title'; document.head.appendChild(mt); }
  mt.content = 'BLKmarketplace'; document.title = 'BLKmarketplace';

  // ---------------------------------------------------------------- Logos de bienvenue
  ['onbLogoImg', 'onbWelcomeLogoImg'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.onerror = null; el.src = '/icon-512.png'; el.style.display = ''; el.style.borderRadius = '26px'; }
  });

  // ---------------------------------------------------------------- Écran de démarrage (≈ 11 s)
  (function intro() {
    try { if (sessionStorage.getItem('blk_intro')) return; sessionStorage.setItem('blk_intro', '1'); } catch (e) {}
    var d = document.createElement('div'); d.id = 'blkIntro';
    var name = 'BLKmarketplace', letters = '';
    for (var i = 0; i < name.length; i++) letters += '<span class="l' + (i > 2 ? ' m' : '') + '" style="--i:' + i + '">' + name[i] + '</span>';
    var text = "Une marketplace mobile avec une identité visuelle africaine, pour le marché congolais (XAF). Les utilisateurs peuvent publier des articles à vendre, en acheter, discuter entre eux, et payer/recevoir de l'argent via Mobile Money (MTN / Airtel)";
    var words = text.split(' ').map(function (w, i) { return '<span class="w" style="--i:' + i + '">' + w + '</span>'; }).join(' ');
    d.innerHTML = '<div class="bi-glow"></div><div class="bi-logo"><div class="bi-orbit">' + orbit(190, 9, '#fff') + '</div><div class="bi-card"><img src="/icon-512.png" alt="BLK"></div></div>' +
      '<div class="bi-name">' + letters + '</div><div class="bi-bar"></div><p class="bi-text" id="biText">' + words + '</p><div class="bi-progress"><i></i></div>';
    document.body.appendChild(d);
    setTimeout(function () { d.classList.add('s2'); }, 3000);
    setTimeout(function () { var t = $('#biText'); if (t) t.classList.add('on'); }, 5600);
    setTimeout(function () { d.classList.add('out'); }, 11000);
    setTimeout(function () { d.remove(); }, 11800);
  })();

  // ---------------------------------------------------------------- Flammes
  function flameCfg(c) {
    var hue = 0;
    if (c >= 100) hue = c < 250 ? 185 * (c - 100) / 150 : 185 + 75 * Math.min(1, (c - 250) / 750);
    var size = 24 + 6 * Math.min(1, c / 100) + (c > 100 ? 16 * Math.min(1, (c - 100) / 900) : 0) + (c > 1000 ? Math.min(10, Math.log10(c / 1000) * 14) : 0);
    return { hue: hue, size: size, dur: c >= 1000 ? 0.8 : (c >= 100 ? 1.1 : 1.5), gh: (25 + hue) % 360, glow: c >= 1000 ? 12 : (c >= 100 ? 8 : 4) };
  }
  function flameImg(c, small) {
    var t = flameCfg(c), h = Math.round(t.size * (small ? 0.62 : 1));
    return '<img class="blk-flame" src="/images/flamme.png" alt="flammes" style="height:' + h + 'px;width:auto;--fd:' + t.dur + 's;filter:hue-rotate(' + Math.round(t.hue) + 'deg) drop-shadow(0 0 ' + t.glow + 'px hsla(' + Math.round(t.gh) + ',100%,55%,.85))">';
  }
  function num(el) { var m = el && (el.textContent || '').match(/\d+/); return m ? parseInt(m[0], 10) : null; }
  function decorateFlames() {
    var cnt = $('#profileFlamesCount'), lab = $('#btnFlameInfo .stat-label-new');
    if (cnt && lab) {
      var pc = parseInt(cnt.textContent, 10) || 0;
      if (lab.dataset.bfc !== String(pc)) {
        lab.dataset.bfc = String(pc); lab.classList.add('blk-flame-label');
        lab.innerHTML = flameImg(pc) + '<span class="blk-info">ⓘ</span>';
        var n = $('#profileFlamesNew'); if (n) n.style.color = 'hsl(' + Math.round(flameCfg(pc).gh) + ',90%,50%)';
      }
    }
    $$('.user-search-flames:not([data-bf]), .modal-content span:not([data-bf])').forEach(function (el) {
      if (el.children.length) return;
      if (!/^\s*(\d+\s+)?flammes?\s*$/i.test(el.textContent)) return;
      el.dataset.bf = '1';
      var n = num(el);
      if (n === null) { var pr = el.previousElementSibling; while (pr && pr.tagName === 'BR') pr = pr.previousElementSibling; n = num(pr); }
      n = n || 0;
      var inList = el.classList.contains('user-search-flames');
      el.innerHTML = (inList ? n + ' ' : '') + flameImg(n, inList);
    });
  }

  // ---------------------------------------------------------------- Images des fenêtres (colis / connexion)
  function modalArt() {
    $$('.modal-overlay .modal-content:not([data-ba])').forEach(function (m) {
      var src = null;
      if ($('#confirmReceiptBtn', m)) src = '/images/colis.png';
      else if ($('#confirmPaymentBtn', m)) src = '/images/connexion.png';
      if (!src) return;
      m.dataset.ba = '1';
      var im = document.createElement('img'); im.className = 'blk-modal-art'; im.src = src; im.alt = ''; im.draggable = false;
      m.insertBefore(im, m.firstChild);
    });
  }

  // ---------------------------------------------------------------- Accueil : proximité + vendeurs en vue
  function getScope() { try { return localStorage.getItem('blk_scope') || 'mine'; } catch (e) { return 'mine'; } }
  function updateScopeBar() {
    var bar = $('#blkScope'), u = me(); if (!bar) return;
    if (!u.country) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    var s = getScope();
    bar.innerHTML = '<button class="blk-chip' + (s === 'mine' ? ' on' : '') + '" data-s="mine">📍 ' + (u.city || u.country) + '</button><button class="blk-chip' + (s === 'all' ? ' on' : '') + '" data-s="all">🌍 Tout</button>';
    $$('.blk-chip', bar).forEach(function (b) {
      b.addEventListener('click', function () { try { localStorage.setItem('blk_scope', b.dataset.s); } catch (e) {} updateScopeBar(); window.renderProducts(); });
    });
  }
  function tms(p) { try { var d = parseServerDate(p.createdAt); return d ? d.getTime() : 0; } catch (e) { return 0; } }
  function pickFeatured(f) {
    var by = {};
    f.forEach(function (p) { if ((p.sellerFlames || 0) > 0 && (!by[p.sellerId] || tms(p) > tms(by[p.sellerId]))) by[p.sellerId] = p; });
    var arr = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return b.sellerFlames - a.sellerFlames; }).slice(0, 9);
    var bucket = Math.floor(Date.now() / (30 * 60 * 1000)), out = [];
    for (var i = 0; i < Math.min(3, arr.length); i++) out.push(arr[(bucket + i) % arr.length]);
    return out;
  }
  window.renderProducts = function () {
    var grid = $('#productsGrid'), empty = $('#emptyHome'); if (!grid) return;
    var f = (allProducts || []).slice(), u = me();
    if (selectedCategory !== 'all') f = f.filter(function (p) { return p.category === selectedCategory; });
    if (selectedGender !== 'all') f = f.filter(function (p) { return p.targetGender === selectedGender || p.targetGender === 'unisexe'; });
    var si = $('#searchInput'), q = si ? si.value.toLowerCase() : '';
    if (q) f = f.filter(function (p) { return p.title && p.title.toLowerCase().indexOf(q) >= 0; });
    if (u.country) {
      if (getScope() === 'mine') f = f.filter(function (p) { return !p.country || norm(p.country) === norm(u.country); });
      f = f.map(function (p, i) {
        var s = (p.country && norm(p.country) === norm(u.country)) ? ((p.city && u.city && norm(p.city) === norm(u.city)) ? 2 : 1) : 0;
        return { p: p, i: i, s: s };
      }).sort(function (a, b) { return b.s - a.s || a.i - b.i; }).map(function (x) { return x.p; });
    }
    var feat = (selectedCategory === 'all' && !q) ? pickFeatured(f) : [];
    var list = feat.concat(f.filter(function (p) { return feat.indexOf(p) < 0; }));
    grid.innerHTML = '';
    if (!list.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    list.forEach(function (p) {
      var card = document.createElement('div'); card.className = 'article-card';
      var img = p.image || (p.images && p.images[0]) || PLACEHOLDER_IMAGE;
      card.innerHTML = safeImgTag(img, p.title) + (feat.indexOf(p) >= 0 ? '<span class="blk-card-flame">' + flameImg(p.sellerFlames, true) + formatNumber(p.sellerFlames) + '</span>' : '');
      card.addEventListener('click', function () { openProductFullscreen(p); });
      grid.appendChild(card);
    });
  };
  function initHome() {
    var gf = $('#genderFilters');
    if (gf && !gf.dataset.bs) {
      gf.dataset.bs = '1';
      var bar = document.createElement('div'); bar.id = 'blkScope'; bar.className = 'blk-scope';
      gf.parentNode.insertBefore(bar, gf); updateScopeBar();
    }
    var si = $('#searchInput');
    if (si && !si.dataset.bs) { si.dataset.bs = '1'; si.addEventListener('input', function () { window.renderProducts(); }); }
  }

  // ---------------------------------------------------------------- Inscription : pays + ville
  function initRegister() {
    var form = $('#step2FormOnb'); if (!form || form.dataset.bs) return;
    form.dataset.bs = '1';
    var err = $('#step2ErrorOnb');
    var g1 = document.createElement('div'); g1.className = 'onboard-input-group'; g1.innerHTML = '<select id="regCountry" required>' + countryOptions('') + '</select>';
    var g2 = document.createElement('div'); g2.className = 'onboard-input-group'; g2.innerHTML = '<input type="text" id="regCity" placeholder="Ville" required autocomplete="off">';
    err.parentNode.insertBefore(g1, err); err.parentNode.insertBefore(g2, err);
    bindCities($('#regCountry'), $('#regCity'), 'blkCitiesReg');
    form.addEventListener('submit', function (e) {
      var c = $('#regCountry').value, ci = $('#regCity').value.trim();
      if (!c || !ci) { e.preventDefault(); e.stopImmediatePropagation(); err.style.display = 'block'; err.textContent = 'Choisis ton pays et ta ville.'; return; }
      registerData.country = c; registerData.city = ci;
    }, true);
  }
  document.addEventListener('focusin', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('.onboard-screen')) setTimeout(function () { try { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) {} }, 350);
  });
  if (window.visualViewport) {
    var setKb = function () { document.documentElement.style.setProperty('--kb', Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop) + 'px'); };
    visualViewport.addEventListener('resize', setKb); visualViewport.addEventListener('scroll', setKb);
  }

  // ---------------------------------------------------------------- Publication : pointures / tailles + pays / ville
  var LETTERS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Taille unique'];
  function range(a, b, step, suf) { var o = []; for (var i = a; i <= b; i += step) o.push(i + (suf || '')); return o; }
  function opts(list) { return list.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join(''); }
  function enhancePublish() {
    var cat = $('#pubCategory'); if (!cat || cat.dataset.bs) return;
    cat.dataset.bs = '1';
    var gen = $('#pubGender'), size = $('#pubSize'), sf = size.closest('.publish-field'), lab = $('label', sf);
    function fill() {
      var c = cat.value, kid = gen.value === 'enfant';
      if (c === 'chaussures') { lab.textContent = 'Pointure'; size.innerHTML = '<option value="">Choisir la pointure</option>' + opts(kid ? range(20, 35, 1) : range(35, 47, 1)); sf.style.display = ''; }
      else if (c === 'robes' || c === 'hauts' || c === 'bas') {
        lab.textContent = 'Taille';
        size.innerHTML = '<option value="">Choisir la taille</option>' + (kid ? opts(range(2, 14, 1, ' ans')) : '<optgroup label="Lettres">' + opts(LETTERS) + '</optgroup><optgroup label="Numéros (EU)">' + opts(range(34, 52, 2)) + '</optgroup>');
        sf.style.display = '';
      } else { size.innerHTML = '<option value=""></option>'; sf.style.display = 'none'; }
    }
    cat.addEventListener('change', fill); gen.addEventListener('change', fill); fill();
    var hf = $('#pubHashtags'), hfield = hf.closest('.publish-field');
    $('label', hfield).textContent = 'Mots-clés (séparés par des virgules)'; hf.placeholder = 'Ex: wax, été, soirée';
    var u = me(), loc = document.createElement('div');
    loc.innerHTML = '<div class="publish-field"><label>Pays *</label><select id="pubCountry">' + countryOptions(u.country) + '</select></div><div class="publish-field"><label>Ville *</label><input type="text" id="pubCity" placeholder="Ex: Brazzaville" value="' + (u.city || '').replace(/"/g, '&quot;') + '"></div>';
    while (loc.firstChild) hfield.parentNode.insertBefore(loc.firstChild, hfield);
    bindCities($('#pubCountry'), $('#pubCity'), 'blkCitiesPub');
    var sub = $('#pubSubmit');
    if (sub) sub.addEventListener('click', function (e) {
      if (!$('#pubCountry').value || !$('#pubCity').value.trim()) { e.stopImmediatePropagation(); showAlert('Indique le pays et la ville de l’article.', 'error'); }
    }, true);
  }
  var _api = window.apiFetch;
  window.apiFetch = function (url, options) {
    options = options || {};
    try {
      if (options.method === 'POST' && typeof options.body === 'string') {
        var b = null;
        if (url === '/api/auth/register') { b = JSON.parse(options.body); b.country = registerData.country || ''; b.city = registerData.city || ''; }
        else if (url === '/api/articles') { b = JSON.parse(options.body); var pc = $('#pubCountry'), pi = $('#pubCity'); b.country = pc ? pc.value : (me().country || ''); b.city = pi ? pi.value.trim() : (me().city || ''); }
        if (b) options = Object.assign({}, options, { body: JSON.stringify(b) });
      }
    } catch (e) {}
    return _api(url, options);
  };

  // ---------------------------------------------------------------- Anciens comptes : demander pays et ville une fois
  function askLocation() {
    var u = me();
    if (u.country || !authToken || !$('#appContainer.active') || $('#blkIntro')) return;
    try { if (sessionStorage.getItem('blk_loc_asked')) return; sessionStorage.setItem('blk_loc_asked', '1'); } catch (e) {}
    var ov = openModal('<h3 style="text-align:center;margin-bottom:6px;">📍 Où es-tu ?</h3><p style="text-align:center;color:#999;font-size:13px;margin-bottom:14px;">On te proposera d’abord les articles près de chez toi.</p>' +
      '<select id="locCountry" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;font-size:16px;background:var(--input-bg);color:var(--text);">' + countryOptions('') + '</select>' +
      '<input type="text" id="locCity" placeholder="Ville" autocomplete="off" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:12px;font-size:16px;background:var(--input-bg);color:var(--text);">' +
      '<button class="btn btn-primary" id="locSave">Enregistrer</button><button class="btn btn-outline" id="locSkip" style="margin-top:8px;">Plus tard</button>');
    bindCities($('#locCountry', ov), $('#locCity', ov), 'blkCitiesLoc');
    $('#locSkip', ov).addEventListener('click', function () { ov.remove(); });
    $('#locSave', ov).addEventListener('click', function () {
      var c = $('#locCountry', ov).value, ci = $('#locCity', ov).value.trim();
      if (!c || !ci) { showAlert('Choisis ton pays et ta ville.', 'error'); return; }
      apiFetch('/api/users/' + currentUserId, { method: 'PUT', body: JSON.stringify({ country: c, city: ci }) }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.success) { currentUser.country = c; currentUser.city = ci; localStorage.setItem('currentUser', JSON.stringify(currentUser)); ov.remove(); updateScopeBar(); window.renderProducts(); showAlert('Enregistré !', 'success'); }
        else showAlert('Enregistrement impossible, réessaie.', 'error');
      }).catch(function () { showAlert('Erreur réseau.', 'error'); });
    });
  }

  // ---------------------------------------------------------------- Boucle de mise à jour
  var pending = false;
  function run() {
    pending = false;
    try { initHome(); initRegister(); enhancePublish(); modalArt(); decorateFlames(); updateScopeBarIfNeeded(); askLocation(); } catch (e) { console.warn('blk-features:', e); }
  }
  var lastScopeKey = '';
  function updateScopeBarIfNeeded() { var u = me(), k = (u.country || '') + '|' + (u.city || ''); if (k !== lastScopeKey) { lastScopeKey = k; updateScopeBar(); } }
  new MutationObserver(function () { if (!pending) { pending = true; requestAnimationFrame(run); } }).observe(document.body, { childList: true, subtree: true, characterData: true });
  run();
  setTimeout(function () { try { window.renderProducts(); } catch (e) {} }, 500);
})();

/* ===================== v2 : messagerie, WhatsApp, historique 14 jours ===================== */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var st = document.createElement('style');
  st.textContent =
    'body.blk-chat-open{overflow:hidden}' +
    '.chat-fullscreen{overscroll-behavior:none}' +
    '.chat-contact-info{cursor:pointer}' +
    '.contact-row.blk-unread .contact-row-name{font-weight:900}' +
    '.contact-row.blk-unread .contact-row-preview{color:var(--text);font-weight:600}' +
    '.contact-row.blk-unread .contact-row-badge{background:#25D366;box-shadow:0 0 0 2px rgba(37,211,102,.25)}' +
    '.blk-wa-btn{background:#25D366!important;color:#fff!important;border:none}' +
    '.blk-orders-note{font-size:12px;color:#999;margin:-2px 0 12px}';
  document.head.appendChild(st);

  // ---- 1) Clavier : la discussion garde toujours la zone visible et le dernier message
  function fit() {
    var c = $('#chatFullscreen'); if (!c) return;
    var open = c.classList.contains('active');
    document.body.classList.toggle('blk-chat-open', open);
    var vv = window.visualViewport;
    if (!open || !vv) { if (c.style.height) { c.style.height = ''; c.style.top = ''; c.style.bottom = ''; } return; }
    c.style.top = vv.offsetTop + 'px'; c.style.bottom = 'auto'; c.style.height = vv.height + 'px';
    var m = $('#messagesList'); if (m) m.scrollTop = m.scrollHeight;
  }
  if (window.visualViewport) { visualViewport.addEventListener('resize', fit); visualViewport.addEventListener('scroll', fit); }
  document.addEventListener('focusin', function (e) {
    if (e.target && e.target.id === 'messageInput') { [30, 150, 350, 700].forEach(function (t) { setTimeout(function () { window.scrollTo(0, 0); fit(); }, t); }); }
  });
  document.addEventListener('focusout', function (e) { if (e.target && e.target.id === 'messageInput') setTimeout(fit, 150); });

  // ---- 2) Clic sur la photo du vendeur dans la discussion : ses articles en vente
  function showSellerArticles(id, name) {
    var ov = openModal('<h3 style="text-align:center;margin-bottom:12px;">Articles de ' + escapeHtml(name) + '</h3><div id="blkSA" class="articles-grid"><p class="empty" style="grid-column:1/-1;">Chargement...</p></div><button class="btn btn-outline" id="blkSAclose" style="margin-top:12px;">Fermer</button>');
    $('#blkSAclose', ov).addEventListener('click', function () { ov.remove(); });
    apiFetch('/api/articles/seller/' + id).then(function (r) { return r.json(); }).then(function (d) {
      var box = $('#blkSA', ov); if (!box) return;
      var list = (d && d.success && d.data ? d.data : []).filter(function (a) { return a.status === 'active'; });
      if (!list.length) { box.innerHTML = '<p class="empty" style="grid-column:1/-1;">Aucun article en vente</p>'; return; }
      box.innerHTML = '';
      list.forEach(function (a) {
        var card = document.createElement('div'); card.className = 'article-card';
        card.innerHTML = safeImgTag(a.image || (a.images && a.images[0]) || PLACEHOLDER_IMAGE, a.title) + '<div style="padding:6px 8px;font-size:12px;font-weight:700;">' + Number(a.price || 0) + ' FCFA</div>';
        card.addEventListener('click', function () { ov.remove(); openProductFullscreen(a); });
        box.appendChild(card);
      });
    }).catch(function () { var box = $('#blkSA', ov); if (box) box.innerHTML = '<p class="empty" style="grid-column:1/-1;">Erreur de chargement</p>'; });
  }

  // ---- 3) Messages non lus + liste sans clignotement
  var _lm = window.loadMessages, lastSig = '';
  window.loadMessages = function () {
    if (typeof currentUserId === 'undefined' || !currentUserId) return;
    return apiFetch('/api/messages/' + currentUserId).then(function (r) { return r.json(); }).then(function (d) {
      var list = (d && d.success && d.data) ? d.data : [];
      var sig = list.map(function (m) { return (m.id || '') + (m.read ? 1 : 0) + ((m.text || '').length); }).join(',') + '|' + Object.keys(localContacts).length + '|' + JSON.stringify(locallyReadAt);
      var c = $('#contactsList');
      if (sig === lastSig && c && c.children.length) return;   // rien n'a changé : on ne touche pas à l'écran
      lastSig = sig; return _lm();
    }).catch(function () { return _lm(); });
  };
  setInterval(function () { if (typeof authToken !== 'undefined' && authToken && !document.hidden) window.loadMessages(); }, 15000);

  var _lc = window.loadConversation, lastMark = {};
  window.loadConversation = function (id) {
    _lc(id);
    var n = Date.now();
    if (id && (!lastMark[id] || n - lastMark[id] > 4000)) {
      lastMark[id] = n;
      apiFetch('/api/messages/read', { method: 'POST', body: JSON.stringify({ contactId: id }) }).catch(function () {});
    }
  };

  // ---- 4) Photo de profil : on ne la redessine que si quelque chose a changé
  var _upd = window.updateProfileUI, lastProf = '';
  window.updateProfileUI = function (u) {
    var sig = [u && u.name, u && u.email, u && u.phone, u && u.photo, !!(u && u.online)].join('|');
    if (sig === lastProf && $('#profileAvatarContainer img, #profileAvatarLetter')) return;
    lastProf = sig; _upd(u);
  };

  function tweakList() {
    var c = $('#contactsList'); if (!c) return;
    var rows = $$('.contact-row', c);
    rows.forEach(function (r) { r.classList.toggle('blk-unread', !!$('.contact-row-badge', r)); });
    var empties = rows.filter(function (r) { var p = $('.contact-row-preview', r); return p && p.textContent === 'Nouvelle conversation'; });
    var want = rows.filter(function (r) { return empties.indexOf(r) < 0; }).concat(empties);
    if (!want.every(function (r, i) { return rows[i] === r; })) want.forEach(function (r) { c.appendChild(r); });
  }

  // ---- 5) WhatsApp à la publication
  function showWa(i) {
    var where = [i.city, i.country].filter(Boolean).join(', ');
    var text = '🛍️ ' + i.title + '\n💰 ' + i.price + ' FCFA' + (where ? '\n📍 ' + where : '') + '\n\nDisponible sur BLKmarketplace 👉 ' + location.origin;
    var url = 'https://wa.me/?text=' + encodeURIComponent(text);
    var canFile = !!(navigator.canShare && navigator.share && i.img);
    var ov = openModal('<div style="text-align:center;"><div style="font-size:40px;">✅</div><h3 style="margin:6px 0;">Article publié !</h3><p style="color:#666;font-size:14px;margin:8px 0 14px;">Partage-le maintenant sur WhatsApp (statut, groupe ou contact).</p>' +
      '<a class="btn blk-wa-btn" href="' + url + '" target="_blank" rel="noopener" style="display:block;text-decoration:none;padding:12px;">Ouvrir WhatsApp</a>' +
      (canFile ? '<button class="btn blk-wa-btn" id="blkWaPhoto" style="margin-top:8px;">Partager avec la photo</button>' : '') +
      '<button class="btn btn-outline" id="blkWaNo" style="margin-top:8px;">Non merci</button></div>');
    $('#blkWaNo', ov).addEventListener('click', function () { ov.remove(); });
    var pb = $('#blkWaPhoto', ov);
    if (pb) pb.addEventListener('click', function () {
      fetch(i.img).then(function (r) { return r.blob(); }).then(function (b) {
        var f = new File([b], 'article.jpg', { type: b.type || 'image/jpeg' });
        if (navigator.canShare({ files: [f] })) return navigator.share({ files: [f], text: text });
        throw new Error('no');
      }).catch(function () { window.open(url, '_blank'); });
    });
  }

  var _api2 = window.apiFetch;
  window.apiFetch = function (url, options) {
    options = options || {};
    var m = (options.method || 'GET').toUpperCase();
    var p = _api2(url, options);
    // ---- 6) Historique des commandes : 14 jours
    if (m === 'GET' && /^\/api\/orders\/[^\/?]+$/.test(url) && !/\/(create|confirm)$/.test(url)) {
      return p.then(function (res) {
        return res.clone().json().then(function (arr) {
          if (!Array.isArray(arr)) return res;
          var cut = Date.now() - 14 * 864e5;
          var f = arr.filter(function (o) { var d = parseServerDate(o.createdAt); return !d || d.getTime() >= cut; });
          return new Response(JSON.stringify(f), { status: res.status, headers: { 'Content-Type': 'application/json' } });
        }).catch(function () { return res; });
      });
    }
    if (m === 'POST' && url === '/api/articles' && window.__blkWa) {
      var info = null;
      try { var b = JSON.parse(options.body); info = { title: b.title, price: b.price, city: b.city, country: b.country, img: (b.images || [])[0] }; } catch (e) {}
      return p.then(function (res) {
        res.clone().json().then(function (d) { if (d && d.success && info) { window.__blkWa = false; showWa(info); } }).catch(function () {});
        return res;
      });
    }
    return p;
  };

  function run() {
    var info = $('#chatFullscreen .chat-contact-info');
    if (info && !info.dataset.bs) {
      info.dataset.bs = '1';
      info.addEventListener('click', function () {
        if (typeof activeConversationId !== 'undefined' && activeConversationId) showSellerArticles(activeConversationId, ($('.chat-contact-name', info) || {}).textContent || 'ce vendeur');
      });
    }
    var sub = $('#pubSubmit');
    if (sub && !sub.dataset.bw) {
      sub.dataset.bw = '1';
      var wa = document.createElement('button'); wa.className = 'btn blk-wa-btn'; wa.id = 'pubSubmitWa'; wa.style.marginTop = '8px'; wa.textContent = 'Publier et partager sur WhatsApp';
      sub.insertAdjacentElement('afterend', wa);
      wa.addEventListener('click', function () { window.__blkWa = true; sub.click(); });
      sub.addEventListener('click', function (e) { if (e.isTrusted) window.__blkWa = false; }, true);
    }
    var oh = $('#pageOrders h2');
    if (oh && !$('.blk-orders-note')) oh.insertAdjacentHTML('afterend', '<div class="blk-orders-note">Chaque commande reste dans ton historique pendant 14 jours.</div>');
    tweakList(); fit();
  }
  var pend = false;
  new MutationObserver(function () { if (!pend) { pend = true; requestAnimationFrame(function () { pend = false; try { run(); } catch (e) { console.warn('blk-features v2:', e); } }); } })
    .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  run();
})();
