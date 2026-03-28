const VERSION = "v1.0.3"; // 🔥 change on every deploy
const CACHE_NAME = "vidhwaan-" + VERSION;

/* CORE ASSETS (KEEP LIGHT) */
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

  /* 🔥 IGNORE NON-GET (IMPORTANT) */
  if (req.method !== "GET") return;


  /* 🔥 1. GEO FILES → STALE-WHILE-REVALIDATE */
  if (req.url.includes("/geo/")) {
    event.respondWith(
      caches.match(req).then(cacheRes => {

        const fetchPromise = fetch(req).then(networkRes => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(req, networkRes.clone());
          });
          return networkRes;
        }).catch(() => cacheRes);

        return cacheRes || fetchPromise;
      })
    );
    return;
  }


  /* 🔥 2. STATIC (JS/CSS/IMG/FONTS) → CACHE FIRST */
  if (
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "image" ||
    req.destination === "font"
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


  /* 🔥 3. HTML → NETWORK FIRST + OFFLINE FALLBACK */
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
