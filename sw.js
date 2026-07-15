const CACHE_NAME = 'gaboo-scan-v1';
const ASSETS = [
  '/gabo_favor/',
  '/gabo_favor/index.html',
  '/gabo_favor/manifest.json',
  '/gabo_favor/imagen_2026-07-15_001254054.svg',
  '/gabo_favor/icon-192.png',
  '/gabo_favor/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Orbitron&display=swap',
  'https://fonts.gstatic.com/s/orbitron/v31/yMJRMIoyzdV49gyqYL1WKA.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetched = fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, clone);
          });
          return res;
        });
        return cached || fetched;
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (res && res.status === 200 && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
