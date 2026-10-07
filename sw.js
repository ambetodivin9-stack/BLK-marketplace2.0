const CACHE = 'blk-v6';
const SHELL = ['./', 'index.html', 'manifest.json', 'logo.png', 'banner.jpg', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'blk-extras.js', 'blk-boot.js', 'mascot.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // Images : affichées tout de suite depuis la mémoire, mises à jour en arrière-plan
  if (/\.(png|jpe?g|webp|svg|gif|ico)$/i.test(url.pathname)) {
    e.respondWith(caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || net;
    }));
    return;
  }

  // Page et scripts : réseau d'abord, mais on n'attend jamais plus de 3 secondes
  e.respondWith(new Promise(resolve => {
    let done = false;
    const timer = setTimeout(() => {
      caches.match(req).then(c => { if (c && !done) { done = true; resolve(c); } });
    }, 3000);
    fetch(req).then(res => {
      clearTimeout(timer);
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      if (!done) { done = true; resolve(res); }
    }).catch(() => {
      clearTimeout(timer);
      caches.match(req).then(c => { if (!done) { done = true; resolve(c || caches.match('index.html')); } });
    });
  }));
});

// ----- Notifications push : message reçu même application fermée -----
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(
    self.registration.showNotification(d.title || 'BLK Marketplace', {
      body: d.body || 'Nouveau message',
      tag: d.tag || 'blk-msg',
      renotify: true,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      data: d
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const d = e.notification.data || {};
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) {
          c.postMessage({ type: 'open-chat', senderId: d.senderId, senderName: d.senderName });
          return c.focus();
        }
      }
      return self.clients.openWindow(self.registration.scope + '#chat=' + encodeURIComponent(d.senderId || '') + '&name=' + encodeURIComponent(d.senderName || ''));
    })
  );
});