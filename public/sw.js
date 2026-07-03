const CACHE_NAME = 'web-ide-v86-v1';
const CACHEABLE_PREFIXES = [
  'https://copy.sh/v86/',
  'https://dl-cdn.alpinelinux.org/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const shouldCache = CACHEABLE_PREFIXES.some((prefix) => request.url.startsWith(prefix))
    || request.url.includes('/v86/v86.wasm');

  if (!shouldCache) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    }),
  );
});
