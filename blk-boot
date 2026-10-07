/* BLK Marketplace - démarrage rapide
   À charger tout en haut de index.html (dans <head>), avant le script principal. */
(function () {
  var BACKEND = 'https://blk-marketplace2-0.onrender.com';
  var origFetch = window.fetch.bind(window);

  // 1) Réveil immédiat du serveur : sur l'offre gratuite de Render il s'endort après 15 min sans visite.
  //    On lui envoie un signal dès l'ouverture de l'app, avant même la connexion.
  try { origFetch(BACKEND + '/ping', { mode: 'no-cors', cache: 'no-store' }).catch(function () {}); } catch (e) {}

  // 2) Une seule requête pour plusieurs demandes identiques (l'app demande plusieurs fois
  //    les mêmes commandes / messages au démarrage) + mémoire de 4 secondes.
  var TTL = 4000, cache = {};
  function keyOf(url, init) {
    var a = '';
    try { var h = init && init.headers; a = h ? (h.Authorization || h.authorization || '') : ''; } catch (e) {}
    return url + '|' + a;
  }
  function shared(url, init) {
    var k = keyOf(url, init), c = cache[k];
    if (c && (c.pending || Date.now() - c.t < TTL)) return c.p.then(function (r) { return r.clone(); });
    var entry = { pending: true, t: 0 };
    entry.p = origFetch(url, init).then(function (r) {
      entry.pending = false; entry.t = Date.now();
      if (!r.ok) { delete cache[k]; }
      return r;
    }, function (err) { delete cache[k]; throw err; });
    cache[k] = entry;
    return entry.p.then(function (r) { return r.clone(); });
  }
  function afterDom() {
    return new Promise(function (res) {
      if (document.readyState !== 'loading') res();
      else document.addEventListener('DOMContentLoaded', function () { res(); });
    });
  }

  // 3) Articles : au lancement, on affiche tout de suite ceux de la dernière visite,
  //    pendant que la version à jour se charge en arrière-plan.
  var ART = BACKEND + '/api/articles', KEY = 'blk_articles_cache', firstArticles = true;
  function markLoaded() {
    window.__articlesLoaded = true;
    try { document.dispatchEvent(new Event('blk-articles-loaded')); } catch (e) {}
  }

  window.fetch = function (url, init) {
    if (typeof url === 'string' && url.indexOf(BACKEND) === 0) {
      var method = (init && init.method) ? String(init.method).toUpperCase() : 'GET';
      if (method !== 'GET') { cache = {}; return origFetch(url, init); }   // une modification vide la mémoire

      if (url === ART && firstArticles) {
        firstArticles = false;
        var cached = null;
        try { cached = localStorage.getItem(KEY); } catch (e) {}
        var fresh = shared(url, init).then(function (rc) {
          return rc.clone().text().then(function (t) {
            if (rc.ok) { try { if (t.length < 2500000) localStorage.setItem(KEY, t); } catch (e) {} markLoaded(); }
            return { rc: rc, text: t };
          });
        });
        if (cached) {
          fresh.then(function (o) {
            if (o.rc.ok && o.text !== cached) {
              setTimeout(function () { if (typeof window.loadProducts === 'function') window.loadProducts(); }, 0);
            }
          }).catch(function () {});
          return afterDom().then(function () {
            return new Response(cached, { status: 200, headers: { 'Content-Type': 'application/json' } });
          });
        }
        return fresh.then(function (o) { return o.rc; });
      }
      return shared(url, init);
    }
    return origFetch(url, init);
  };
})();
