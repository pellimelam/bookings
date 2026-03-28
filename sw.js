const VERSION = "v1.0.0"; // 🔥 change this to force update
const CACHE_NAME = "vidhwaan-" + VERSION;

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",

  // CSS
  "/css/design-system.css",
  "/css/main.css",

  // JS
  "/utilities/nav.js",
  "/utilities/hero.js",
  "/utilities/footer.js",
  "/utilities/registration.js",

  // GEO JSON
  "/geo_dataset_1.json",
  "/geo_dataset_2.json",
  "/geo_dataset_3.json",
  "/geo_dataset_4.json",
];

/* INSTALL */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* FETCH STRATEGY */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request).then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkRes.clone());
          return networkRes;
        });
      }).catch(() => cacheRes);
    })
  );
});
