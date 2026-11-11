// HomeOS Service Worker
const CACHE_NAME = 'homeos-v6.8';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './moviesData.js',
  './moviesView.js',
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

// Fetch: Network-First for core code (html, css, js) so updates apply immediately on refresh!
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Let Open-Meteo API requests bypass cache
  if (event.request.url.includes('api.open-meteo.com')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  const url = new URL(event.request.url);
  const isCodeAsset = url.pathname.endsWith('.html') ||
                      url.pathname.endsWith('.css') ||
                      url.pathname.endsWith('.js') ||
                      url.pathname === '/' ||
                      url.pathname.endsWith('/HomeOS/') ||
                      url.pathname.endsWith('index.html');

  if (isCodeAsset) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First for static media assets (images, icons, wallpapers)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      });
    })
  );
});
