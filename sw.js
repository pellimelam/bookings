const VERSION = "v1.0.1"; // 🔥 change this on every deploy
const CACHE_NAME = "vidhwaan-" + VERSION;

/* CORE ASSETS ONLY (LIGHTWEIGHT) */
const CORE_ASSETS = [
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
];


/* =========================
   INSTALL
========================= */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});


/* =========================
   ACTIVATE
========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});


/* =========================
   FETCH STRATEGY
========================= */
self.addEventListener("fetch", (event) => {

  const req = event.request;

  /* 🔥 1. GEO JSON → CACHE FIRST (ULTRA FAST) */
  if (req.url.includes("geo_dataset")) {
    event.respondWith(
      caches.match(req).then(cacheRes => {
        return cacheRes || fetch(req).then(networkRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        });
      })
    );
    return;
  }


  /* 🔥 2. STATIC ASSETS → CACHE FIRST */
  if (
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "image"
  ) {
    event.respondWith(
      caches.match(req).then(cacheRes => {
        return cacheRes || fetch(req).then(networkRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        });
      })
    );
    return;
  }


  /* 🔥 3. HTML → NETWORK FIRST (ALWAYS FRESH) */
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(networkRes => {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return networkRes;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }


  /* 🔥 4. DEFAULT FALLBACK */
  event.respondWith(
    caches.match(req).then(cacheRes => cacheRes || fetch(req))
  );

});
