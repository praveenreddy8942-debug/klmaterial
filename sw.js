// Service Worker for PWA — KL Material
// Updated for Netlify deployment (root path, no /klmaterial/ prefix)
const CACHE_NAME = 'klmaterial-v24';

const urlsToCache = [
  '/',
  '/index.html',
  '/materials.html',
  '/roadmap.html',
  '/about.html',
  '/contact.html',
  '/cgpa.html',
  '/attendance.html',
  '/timetable.html',
  '/flashcards.html',
  '/marks.html',
  '/formulas.html',
  '/subject.html',
  '/privacy.html',
  '/offline.html',
  '/404.html',
  '/style.css',
  '/shared.css',
  '/kl-liquid-glass.css',
  '/glass-components.css',
  '/ui.js',
  '/advanced-features.js',
  '/animations.js',
  '/chatbot.js',
  '/github-materials.js',
  '/supabase-db.js',
  '/exam-countdown.js',
  '/quick-notes.js',
  '/todo-widget.js',
  '/streak-widget.js',
  '/shortcuts.js',
  '/nav-dropdown.js',
  '/theme-toggle.js',
  '/study-timer.js',
  '/assets/profile.jpg',
  '/icon.svg',
  '/manifest.json',
];

// Hosts that should never be cached (live API calls)
const BYPASS_HOSTS = [
  'api.github.com',
  'media.githubusercontent.com',
  'raw.githubusercontent.com',
  'data.jsdelivr.com',
  'supabase.co',
  'supabase.com',
  'googletagmanager.com',
  'google-analytics.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'kit.fontawesome.com',
  'cdn.jsdelivr.net',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      // addAll fails silently per-item so we don't block on missing files
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('[SW] Some files failed to cache during install:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
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

// Fetch — Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass cache for external APIs and CDNs
  const isBypass = BYPASS_HOSTS.some((host) => url.hostname.includes(host));
  if (isBypass) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache valid responses
        if (response && response.status === 200 && response.type !== 'opaque') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) return response;
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      { action: 'explore', title: 'View Materials' },
      { action: 'close', title: 'Close' },
    ],
  };
  event.waitUntil(
    self.registration.showNotification('KL Material', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/materials.html'));
  }
});
