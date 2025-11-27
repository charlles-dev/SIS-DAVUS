const CACHE_NAME = 'davus-app-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/index.css',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/html5-qrcode'
];

// Install Event: Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First for API, Cache First for static, Fallback for navigation
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // 1. API Requests: Network First, then Cache (if we were caching API responses, but for now just Network)
  // For safety in this app, we might want to just do Network Only for API to avoid stale data, 
  // or Network First if we want offline read-only. Let's stick to Network Only for API for now to avoid complexity,
  // or Network First if we really want offline support.
  // Given the requirements, let's do a simple strategy:

  // Navigation Requests (HTML): Network First -> Cache -> Offline Page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) return response;
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Static Assets: Cache First -> Network
  if (
    requestUrl.pathname.startsWith('/assets') ||
    requestUrl.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|json)$/) ||
    STATIC_ASSETS.includes(requestUrl.pathname)
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          return fetch(event.request).then(networkResponse => {
            // Optional: Cache new static assets dynamically
            return networkResponse;
          });
        })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});