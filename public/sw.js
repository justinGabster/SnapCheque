// Simple pass-through service worker to satisfy PWA installability requirements
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Just pass through all requests for the prototype
  event.respondWith(fetch(event.request));
});
