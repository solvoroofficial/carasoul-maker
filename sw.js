const CACHE_NAME = 'carasoul-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// install: pre-cache minimal shell
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// activate: clean old caches
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
  self.clients.claim();
});

// fetch: network-first for HTML, cache-first for others
self.addEventListener('fetch', (evt) => {
  if (evt.request.mode === 'navigate' || (evt.request.method === 'GET' && evt.request.headers.get('accept').includes('text/html'))) {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('./'))
    );
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then((resp) => resp || fetch(evt.request))
  );
});
