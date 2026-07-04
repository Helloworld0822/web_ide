const CACHE_NAME = 'web-ide-vm-v3';
const CACHEABLE_PATHS = ['/v86/v86.wasm', '/v86/bios/'];

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const shouldCache = CACHEABLE_PATHS.some((segment) => url.pathname.includes(segment));
  if (!shouldCache) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        try {
          await cache.put(request, response.clone());
        } catch {
          // Skip caching if the asset is too large for the Cache API.
        }
      }
      return response;
    }),
  );
});
