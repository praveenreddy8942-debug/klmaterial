/**
 * sw.js - No-op Service Worker
 * 
 * This is a minimal service worker that does NOT intercept fetch requests.
 * It immediately activates and claims clients to replace any previously
 * registered service workers that may be serving stale cached content.
 * 
 * Why this exists:
 * - Previous versions may have cached outdated files causing blank/black pages
 * - This SW replaces the old one and stops caching behavior
 * 
 * To restore full PWA caching:
 * 1. Uncomment the PRODUCTION CACHING section below
 * 2. Update CACHE_NAME with a new version number
 * 3. Update urlsToCache with current asset filenames
 * 
 * Testing:
 * - Clear browser cache and unregister service workers
 * - Visit in incognito mode to verify fresh behavior
 * - Check DevTools > Application > Service Workers
 */

// Immediately take control
self.addEventListener('install', (event) => {
  console.log('[SW] No-op service worker installing');
  self.skipWaiting();
});

// Activate and claim all clients
self.addEventListener('activate', (event) => {
  console.log('[SW] No-op service worker activated');
  
  // Delete all existing caches to clear stale content
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Do NOT intercept fetch - let all requests go to network
// This is intentional to prevent stale cached pages

/*
// =============================================================================
// PRODUCTION CACHING (uncomment when ready to restore PWA functionality)
// =============================================================================

const CACHE_NAME = 'klmaterial-v2';
const urlsToCache = [
  '/klmaterial/',
  '/klmaterial/index.html',
  '/klmaterial/assets/index-CZ2cKUt-.js',
  '/klmaterial/assets/index-Bu9-1msn.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Opened cache');
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
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first, cache fallback
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

