const CACHE_NAME = 'sillu-ia-v4'; // Nueva versión para forzar limpieza

const ASSETS = [
  './',
  './index.html',
  './modelo_puno_final.json',
  './libs/tf.min.js',
  './libs/mobilenet.js',
  './libs/knn-classifier.js',
  './manifest.json',
  './icono.png'
];

// Instalación: Guardar archivos uno por uno para evitar errores
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando archivos para modo offline...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: Borrar cachés antiguos automáticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Interceptor: Priorizar Caché, luego Red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
