const CACHE_NAME = 'sillu-ia-v2';
// Lista de archivos a "congelar" para que funcionen offline
const ASSETS = [
  './',
  './index.html',
  './modelo_puno_final.json',
  './libs/tf.min.js',
  './libs/mobilenet.js',
  './libs/knn-classifier.js'
];

// Instalación: Guarda los archivos en la memoria del navegador
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Interceptor: Cuando MobileNet pida algo a internet, el SW lo entrega desde el disco
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});
