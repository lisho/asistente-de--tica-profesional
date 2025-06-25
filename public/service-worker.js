
const CACHE_NAME = 'etica-profesional-cache-v1';

// Definir explícitamente todos los iconos del manifest.json
const iconsFromManifest = [
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

const urlsToCache = [
  '/index.html',
  '/index.js', 
  '/metadata.json',
  '/eulogio.png',
  '/pepi.png', 
  '/gemini.png', // Nuevo avatar genérico
  ...iconsFromManifest 
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caché abierto');
        const criticalAssets = urlsToCache.filter(url => !url.startsWith('http') && !url.startsWith('https'));
        const nonCriticalAssets = urlsToCache.filter(url => url.startsWith('http') || url.startsWith('https'));
        
        return cache.addAll(criticalAssets).then(() => {
          if (nonCriticalAssets.length > 0) {
            return cache.addAll(nonCriticalAssets).catch(error => {
              console.warn('Falló el almacenamiento en caché de algunos activos no críticos:', error);
            });
          }
        });
      })
  );
  self.skipWaiting();
});

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
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 ) { 
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Falló la obtención:', error);
          return new Response('Error de red al intentar obtener el recurso.', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});
