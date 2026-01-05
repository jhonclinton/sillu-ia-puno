const CACHE_NAME = 'sillu-ia-v8-total';

// Archivos locales mínimos para la instalación inicial
const ASSETS = [
  './',
  './index.html',
  './modelo_puno_final.json',
  './libs/tf.min.js',
  './libs/mobilenet.js',
  './libs/knn-classifier.js',
  './manifest.json'
];

// INSTALACIÓN: Guarda los archivos base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando archivos base...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVACIÓN: Toma el control de la página inmediatamente
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// INTERCEPTOR DINÁMICO: La solución al error de red de MobileNet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
      // 1. Si ya lo tenemos en el disco (incluyendo lo que se guardó de Google), úsalo
      if (cachedResponse) return cachedResponse;

      // 2. Si no está, búscalo en internet y GUÁRDALO para que el próximo F5 no falle
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // Solo guardamos si la respuesta es válida (ej. archivos de tfhub.dev)
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // Si no hay red y no estaba en caché, fallará (esto solo pasará si nunca entraste con red)
        return new Response("Error: Recurso no disponible offline.");
      });
    })
  );
});


