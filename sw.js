// HomeOS Service Worker
const CACHE_NAME = 'homeos-v3.7';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './sky.js',
  './wallpaper.js',
  './manifest.json',
  './assets/icons/movies.svg',
  './assets/icons/shows.svg',
  './assets/icons/music.svg',
  './assets/icons/homeos.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/Wallpapers/s-3am.png',
  './assets/Wallpapers/s-9am.png',
  './assets/Wallpapers/s-3pm.png',
  './assets/Wallpapers/s-9pm.png',
  './assets/Wallpapers/w-3am.png',
  './assets/Wallpapers/w-9am.png',
  './assets/Wallpapers/w-3pm.png',
  './assets/Wallpapers/w-9pm.png',
  './assets/Wallpapers/r-3am.png',
  './assets/Wallpapers/r-9am.png',
  './assets/Wallpapers/r-3pm.png',
  './assets/Wallpapers/r-9pm.png'
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

// Fetch: Cache-first or Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Let Open-Meteo API requests bypass cache
  if (event.request.url.includes('api.open-meteo.com')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
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
