
const CACHE_NAME = 'eulogio-chatbot-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: index.tsx and other JS/CSS modules are typically bundled in production.
  // For a simple non-bundled setup, you might list individual .js files if not loaded via importmap from CDN.
  // For now, relying on browser caching for CDN modules.
  '/avatar-eulogio.jpg',
  '/icon-192x192.png',
  '/icon-512x512.png'
  // Add other critical static assets here
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache or add urls: ', err);
      })
  );
  self.skipWaiting(); // Activate the new service worker immediately
});

// Fetch event: Serve cached assets if available (Cache-first for static assets)
self.addEventListener('fetch', (event) => {
  // For navigation requests, try network first, then cache (for index.html)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .then(response => response || caches.match('/index.html')) // Fallback to cached index.html
    );
    return;
  }

  // For other requests (CSS, JS, images), use cache-first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
            console.warn('Fetch failed; returning offline page instead.', error);
            // Optionally return an offline fallback page for assets if one exists
            // return caches.match('/offline.html'); 
        });
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensure new SW takes control immediately
});
