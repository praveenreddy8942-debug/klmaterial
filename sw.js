/**
 * KL Material - Minimal No-Op Service Worker
 * 
 * This service worker is intentionally minimal to avoid caching issues
 * during development and deployment. It skips waiting and claims clients
 * immediately but does NOT intercept fetch events.
 * 
 * Why no-op?
 * - Prevents stale cache issues on GitHub Pages
 * - Allows easier debugging and development
 * - Can be replaced with a production Workbox-generated SW when ready
 * 
 * How to restore production caching:
 * 1. Install Workbox CLI: npm install -g workbox-cli
 * 2. Create workbox-config.js with your caching strategy
 * 3. Run: workbox generateSW workbox-config.js
 * 4. The generated sw.js will replace this file
 * 
 * Example workbox-config.js:
 * ```javascript
 * module.exports = {
 *   globDirectory: '.',
 *   globPatterns: ['**\/*.{html,js,css,svg,png,jpg}'],
 *   swDest: 'sw.js',
 *   ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
 *   runtimeCaching: [{
 *     urlPattern: /\.(?:js|css)$/,
 *     handler: 'StaleWhileRevalidate'
 *   }]
 * };
 * ```
 * 
 * To unregister this service worker from browsers:
 * 1. Open DevTools → Application → Service Workers
 * 2. Click "Unregister" next to the worker
 * 3. Hard reload the page (Ctrl+Shift+R / Cmd+Shift+R)
 * 
 * Or run this in the console:
 * navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));
 */

// Install: Skip waiting immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing no-op service worker');
  self.skipWaiting();
});

// Activate: Claim all clients and clear any old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating no-op service worker');
  
  // Clear any existing caches from previous service worker versions
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[SW] All caches cleared, claiming clients');
      return self.clients.claim();
    })
  );
});

// NOTE: No fetch event listener!
// This means all network requests go directly to the network.
// This prevents stale content issues but loses offline functionality.

// Optional: Message handler for future communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
