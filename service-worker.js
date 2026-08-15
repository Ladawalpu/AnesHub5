// © 2026 Puladawal S. (puladawal.s@gmail.com) — MNST Hospital. All Rights Reserved. Unauthorized copying, redistribution, or modification of this application is prohibited without written permission.

const CACHE_NAME = 'aneshub-cache-v30';
const ASSETS = [
  './index.html',
  './anesth-cal.html',
  './anesth-drugs.html',
  './cpr-protocol.html',
  './airway-tip.html',
  './pre-anes-guideline.html',
  './clinical-guide.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './images/ekg/normal.jpg',
  './images/ekg/bradycardia.jpg',
  './images/ekg/tachycardia.jpg',
  './images/ekg/af.jpg',
  './images/ekg/flutter.jpg',
  './images/ekg/pvc.jpg',
  './images/ekg/svt.jpg',
  './images/ekg/vt.jpg',
  './images/ekg/vf.jpg',
  './images/ekg/asystole.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
          return res;
        })
        .catch(() => cached);
    })
  );
});
