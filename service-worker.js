// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "deutschapp-page-v1";

const OFFLINE_URL = "/languagesolutionsa2/offline.html"; // Asegúrate que este archivo exista y esté en esa ruta

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        OFFLINE_URL,
        '/languagesolutionsa2/index.html',
        '/languagesolutionsa2/style.css',
        '/languagesolutionsa2/app.js',
        'palabras.js',
        '/languagesolutionsa2/languagesolutionsa2/eis.jpg',
        '/languagesolutionsa2/login.html',
        '/languagesolutionsa2/teacher.html',
        '/languagesolutionsa2/login.js',
        '/languagesolutionsa2/teacher.js'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}
