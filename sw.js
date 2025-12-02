/**
 * Minimal No-Op Service Worker
 * 
 * This service worker does not cache any resources to avoid issues during development
 * and deployment on GitHub Pages. It simply passes all requests through to the network.
 * 
 * To restore full PWA caching capabilities:
 * 1. Uncomment the CACHE_NAME and urlsToCache variables below
 * 2. Uncomment the install, activate, and fetch event handlers
 * 3. Update urlsToCache with your asset URLs
 * 4. Test thoroughly before deploying
 */

// --- FULL SERVICE WORKER CONFIGURATION (currently disabled) ---
// const CACHE_NAME = 'klmaterial-v1';
// const urlsToCache = [
//   './',
//   './index.html',
//   './assets/index-CZ2cKUt-.js',
//   './assets/index-Bu9-1msn.css',
//   './icon.svg'
// ];

// Install: Skip waiting to activate immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate: Claim clients and clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Pass through to network (no caching)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// --- TO ENABLE FULL CACHING, REPLACE THE ABOVE WITH: ---
/*
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching assets');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
*/
