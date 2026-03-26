self.addEventListener("install", (event)=>{
  self.skipWaiting();
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event)=>{

  const url = new URL(event.request.url);

  /* 🔥 HANDLE MANIFEST DYNAMICALLY */
  if(url.pathname === "/manifest.json"){

    const name = url.searchParams.get("name") || "Vidhwaan";
    const start = url.searchParams.get("start") || "/";

    const manifest = {
      name: `VID ${name}`,
      short_name: `VID ${name}`,
      start_url: start,
      display: "standalone",
      background_color: "#020617",
      theme_color: "#1e3a8a",
      icons: [
        {
          src: "/icons1/icon-192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons1/icon-512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };

    event.respondWith(
      new Response(JSON.stringify(manifest), {
        headers: { "Content-Type": "application/json" }
      })
    );

    return;
  }

  /* NORMAL REQUESTS */
  event.respondWith(fetch(event.request));
});
