// バージョンを上げるたびに、古いキャッシュは自動で破棄されます。
const CACHE_VERSION = 'v1';
const CACHE_NAME = `kurashi-app-${CACHE_VERSION}`;

// service-worker.js からの相対パス(GitHub Pagesのサブディレクトリ配信に対応)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // GET以外(AI献立生成のPOSTなど)はService Workerを通さず、常に実際のネットワークへ。
  if (req.method !== 'GET') return;

  // 外部ドメイン(Googleフォントなど)はそのままネットワークに任せる。
  if (!req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    (async () => {
      try {
        // ネットワーク優先: 最新のデザイン・機能をなるべく早く反映する。
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        // オフライン時はキャッシュから返す。
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === 'navigate') {
          const fallback = await caches.match('./index.html');
          if (fallback) return fallback;
        }
        throw err;
      }
    })()
  );
});
