const CACHE_PREFIX = 'pdf-local-toolbox-';
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/index-XfCSYlnY.js',
  './assets/index-CFPIHGYZ.css',
  './assets/layout-DH4mL2.css',
  './assets/ui-polish.js',
  './assets/ui-polish.css',
  './assets/i18n.js',
  './assets/pwa.js',
  './assets/pwa.css',
  './assets/pdf.worker.min-CHFwMXne.mjs',
  './assets/qpdf-C3Giu3T4.wasm',
  './assets/wasm/jbig2.wasm',
  './assets/wasm/openjpeg.wasm',
  './assets/wasm/qcms_bg.wasm',
  './icon/favicon.ico',
  './icon/apple-touch-icon.png',
  './icon/pwa-192x192.png',
  './icon/pwa-512x512.png',
  './privacy/',
  './privacy/index.html',
  './terms/',
  './terms/index.html',
  './licenses/',
  './licenses/index.html',
  './assets/legal-pages.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true }))
      || caches.match('./index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
