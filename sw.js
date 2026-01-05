const CACHE_NAME = 'sillu-ia-v3';

// Lista de archivos locales para que la App funcione en el campo (Puno)
const ASSETS = [
  './',
  './index.html',
  './modelo_puno_final.json',
  './libs/tf.min.js',
  './libs/mobilenet.js',
  './libs/knn-classifier.js',
  './manifest.json'
];

// INSTALACIÓN: Aquí es donde se guardan los archivos en el disco del celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Guardando archivos en caché...');
      return cache.addAll(ASSETS);
    })
  );
  // Fuerza al Service Worker nuevo a tomar el control inmediatamente
  self.skipWaiting();
});

// ACTIVACIÓN: Limpia cachés antiguos si cambias de v2 a v3
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// INTERCEPTOR: Responde desde el caché, y si no está, busca en internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si el archivo está en caché, lo devuelve. Si no, lo pide a la red.
      return response || fetch(event.request);
    })
  );
});
