/* Service Worker — CTC Expo Exhibitor Portal */
const CACHE = 'ctcexpo-v1';
const ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './stand.html',
  './construction.html',
  './catalog.html',
  './badges.html',
  './materials.html',
  './issues.html',
  './faq.html',
  './contacts.html',
  './settings.html',
  './admin.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin && !url.hostname.includes('fonts.google')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
