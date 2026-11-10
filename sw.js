// HomeOS Service Worker
const CACHE_NAME = 'homeos-v2.3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/wallpaper.jpg',
  './assets/icons/netflix-512.png',
  './assets/icons/prime-512.png',
  './assets/icons/jiohotstar-512.png',
  './assets/icons/zee5-512.png',
  './assets/icons/sony-512.png',
  './assets/icons/apple-512.png',
  './assets/icons/fancode-512.png',
  './assets/icons/ytmusic-512.png',
  './assets/icons/youtube-512.png',
  './assets/icons/brave-512.png',
  './assets/icons/homeos.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// Install: Cache all static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate or Cache-first strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Offline fallback */ });
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    })
  );
});
