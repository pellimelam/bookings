const VERSION = "v1.0.5";

/* =========================
   INSTALL
========================= */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});


/* =========================
   ACTIVATE
========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k))) // 🔥 clear everything
    )
  );
  self.clients.claim();
});


/* =========================
   FETCH (NETWORK ONLY)
========================= */
self.addEventListener("fetch", (event) => {

  const req = event.request;

  /* only handle GET */
  if (req.method !== "GET") return;

  event.respondWith(
    fetch(req).catch(() => {
      /* optional fallback */
      return new Response("No internet connection", {
        status: 503,
        statusText: "Offline"
      });
    })
  );

});
