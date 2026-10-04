const CACHE = 'blk-v4';
const SHELL = ['./', 'index.html', 'manifest.json', 'logo.png', 'banner.jpg', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'blk-extras.js'];

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
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
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
