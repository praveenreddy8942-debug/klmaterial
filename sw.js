// Service Worker for KLMaterial PWA
const CACHE_VERSION = 'v2-2026-02-13';
const CORE_CACHE = `klmaterial-core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `klmaterial-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/klmaterial/offline.html';

const CORE_ASSETS = [
  '/klmaterial/',
  '/klmaterial/index.html',
  '/klmaterial/materials.html',
  '/klmaterial/roadmap.html',
  '/klmaterial/about.html',
  '/klmaterial/contact.html',
  '/klmaterial/style.css',
  '/klmaterial/advanced-features.js',
  '/klmaterial/animations.js',
  '/klmaterial/chatbot.js',
  '/klmaterial/ui.js',
  '/klmaterial/github-materials.js',
  '/klmaterial/profile.jpg',
  '/klmaterial/icon.svg',
  '/klmaterial/manifest.json',
  OFFLINE_URL
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (![CORE_CACHE, RUNTIME_CACHE].includes(cacheName)) {
          return caches.delete(cacheName);
        }
        return null;
      })
    ))
  );
  self.clients.claim();
});

function isHtmlRequest(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

function isAssetRequest(request) {
  return request.destination === 'style' || request.destination === 'script' || request.destination === 'font';
}

function isImageRequest(request) {
  return request.destination === 'image';
}

function isCdnRequest(url) {
  return url.origin.includes('jsdelivr.net') || url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com');
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((response) => {
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || networkPromise;
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || caches.match(OFFLINE_URL);
  }
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (isHtmlRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isCdnRequest(url) || isAssetRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('Syncing data...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/klmaterial/icon.svg',
    badge: '/klmaterial/icon.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View Materials',
      },
      {
        action: 'close',
        title: 'Close',
      },
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
    event.waitUntil(
      clients.openWindow('/klmaterial/materials.html')
    );
  }
});
