const CACHE_NAME = "egs-pwa-v8";
const ASSETS = [
"./",
  "./index.html",
  "./manifest.json",
  "./icon-72.png",
  "./icon-96.png",
  "./icon-128.png",
  "./icon-144.png",
  "./icon-192.png",
  "./icon-256.png",
  "./icon-384.png",
  "./icon-512.png",
  "./chapters-data.js",
  "./book.pdf",
  "./chapter-1.jpg",
  "./chapter-2.jpg",
  "./chapter-3.jpg",
  "./chapter-4.jpg",
  "./chapter-5.jpg",
  "./chapter-6.jpg",
  "./chapter-7.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((resp) => {
          const copy = resp.clone();
          const url = new URL(event.request.url);
          if (event.request.method === "GET" && url.origin === self.location.origin) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return resp;
        }).catch(() => cached)
      );
    })
  );
});