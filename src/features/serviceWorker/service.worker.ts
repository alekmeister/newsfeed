const _self = self as unknown as ServiceWorkerGlobalScope;

const version = 'v0.0.4';
const cachePrefix = 'newsfeed-cache';
const cacheName = cachePrefix + '_' + version;

_self.addEventListener('install', (event) => {
  // eslint-disable-next-line no-console
  console.log('Installing [Service Worker]', event);

  event.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      // console.log('[Service Worker] Precaching App Shell');
      cache.addAll([
        '/',
        'https://frontend.karpovcourses.net/api/v2/ru/news',
        'https://frontend.karpovcourses.net/api/v2/ru/trends',
        'https://frontend.karpovcourses.net/api/v2/ru/news/6',
      ]);
    })
  );
});

_self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      // Remove caches whose name is no longer valid
      return Promise.all(
        keys
          .filter(function (key) {
            return key.startsWith(cachePrefix) && !key.endsWith(version);
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

_self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  const request = e.request;
  if (url.startsWith('http') && e.request.method === 'GET') {
    const isHtmlPageRequest =
      request.headers.get('Accept')?.indexOf('text/html') !== -1 && url.startsWith(_self.origin);
    const isImageRequest = !isHtmlPageRequest && request.headers.get('Accept')?.indexOf('image/') !== -1;

    const cacheKey = isHtmlPageRequest ? '/' : e.request;
    // console.log('SW fetch', url, isHtmlPageRequest, isImageRequest, request.headers.get('Accept'));
    e.respondWith(
      (async () => {
        if (isImageRequest) {
          const imageCached = await caches.match(cacheKey);
          if (imageCached) {
            // console.log(`[Service Worker] Return cache resource: ${url}`);
            return imageCached;
          }
        }

        try {
          const response = await fetch(e.request);
          const cache = await caches.open(cacheName);
          // console.log(`[Service Worker] Caching new resource: ${url}`);
          cache.put(cacheKey, response.clone());
          return response;
        } catch (e) {
          // do nothing
        }

        // OFFLINE
        const r = await caches.match(cacheKey);
        // console.log(`[Service Worker] Fetching resource: ${url}`);
        if (r) {
          // console.log(`[Service Worker] Return cache resource: ${url}`);
          return r;
        }
        return new Response('', {
          status: 404,
          statusText: 'Not Found',
        });
      })()
    );
  }
});
