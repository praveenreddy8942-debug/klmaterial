/**
 * Minimal No-Op Service Worker for Development/Debugging
 * 
 * This service worker does NOT intercept fetch requests to avoid
 * serving stale cached content during development or after deployments.
 * 
 * It only handles install/activate events to take control immediately.
 * 
 * HOW TO RESTORE PRODUCTION CACHING:
 * ----------------------------------
 * For production, replace this file with a Workbox-generated service worker.
 * 
 * Option 1: Use Workbox CLI
 *   npm install -g workbox-cli
 *   workbox wizard (follow prompts)
 *   workbox generateSW workbox-config.js
 * 
 * Option 2: Use Vite PWA Plugin (for React apps)
 *   npm install vite-plugin-pwa -D
 *   Add to vite.config.ts:
 *     import { VitePWA } from 'vite-plugin-pwa'
 *     plugins: [VitePWA({ registerType: 'autoUpdate' })]
 * 
 * Option 3: Manual caching (copy from git history)
 *   git show HEAD~1:sw.js > sw.js
 * 
 * HOW TO UNREGISTER THIS SERVICE WORKER:
 * --------------------------------------
 * In browser DevTools Console, run:
 *   navigator.serviceWorker.getRegistrations().then(regs => 
 *     regs.forEach(r => r.unregister())
 *   );
 * Then hard refresh (Ctrl+Shift+R or Cmd+Shift+R).
 */

// Install: Skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] No-op service worker installed');
  self.skipWaiting();
});

// Activate: Claim all clients immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] No-op service worker activated');
  
  // Clear any existing caches from previous service workers
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// NOTE: No fetch handler - all requests go directly to network
// This prevents serving stale content during development
