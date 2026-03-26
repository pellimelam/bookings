import { layout } from "./template/baseTemplate.js";

window.__PROFILE_CACHE = window.__PROFILE_CACHE || {};

function renderLayout(content){
document.getElementById("app").innerHTML = content;
}

export function initRouter(){

if(window.location.pathname.match(/\d{10}$/)){
document.body.innerHTML = "<div id='app'></div>";
}

let path = window.location.pathname.toLowerCase();

/* HANDLE 404 REDIRECT */
const params = new URLSearchParams(window.location.search);
const redirectedPath = params.get("path");

if(redirectedPath){

path = decodeURIComponent(redirectedPath).toLowerCase();

/* 🔥 CLEAN URL (REMOVE ?path=) */
window.history.replaceState({}, "", path);

}

/* IGNORE ROOT */
if(path === "/" || path === "/index.html") return;

/* SPLIT */
const parts = path.split("/").filter(Boolean);

/* FIND PHONE */
let phone = null;

for(const part of parts){
const match = part.match(/(\d{10})$/);
if(match){
phone = match[1];
break;
}
}

if(!phone) return;

// ✅ REMOVE MAIN SUPPORT BUTTON ON PROFILE PAGE
const supportBtn = document.getElementById("supportBtn");
if(supportBtn) supportBtn.remove();

// ✅ HIDE LANDING UI WHEN PROFILE LOADS
["nav","hero","registration","edit","footer","support"].forEach(id=>{
const el = document.getElementById(id);
if(el) el.style.display = "none";
});


/* PAGE TYPE */
let page = "home";

if(path.includes("/gallery")) page = "gallery";
else if(path.includes("/videos")) page = "videos";
else if(path.includes("/about")) page = "about";

/* LOAD */
loadProfilePage(phone, page);

}




async function loadProfilePage(phone, page){

try{

/* =========================
   STEP 1: ALWAYS CHECK GITHUB (TRUTH)
========================= */

const CACHE_KEY = `profile_${phone}`;

const mem = window.__PROFILE_CACHE[phone];
let cached = localStorage.getItem(CACHE_KEY);
cached = cached ? JSON.parse(cached) : null;

if(mem && cached && mem.version === cached.version){

  renderPage(mem, page);

  // 🔥 SAFE BACKGROUND VERIFY
  fetch(`https://raw.githubusercontent.com/vidhwaan/${phone}/main/data.json`)
    .then(r => {
      if(!r.ok) throw new Error("fetch failed");
      return r.json();
    })
    .then(newData => {
      if(newData.version !== mem.version){

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          version: newData.version,
          data: newData
        }));

        window.__PROFILE_CACHE[phone] = newData;

        // ✅ prevent flicker in background tab
        if(document.visibilityState === "visible"){
          renderPage(newData, page);
        }
      }
    })
    .catch(()=>{});

  return;
}


/* =========================
   STEP 2: FETCH LATEST
========================= */

const rawRes = await fetch(
  `https://raw.githubusercontent.com/vidhwaan/${phone}/main/data.json`
);

if(!rawRes.ok){

  if(cached){
    renderPage(cached.data, page);
    return;
  }

  document.body.innerHTML = "Profile not found";
  return;
}

const latestData = await rawRes.json();

/* =========================
   STEP 3: VERSION CHECK
========================= */

let finalData;

if(cached && cached.version === latestData.version){
  finalData = cached.data;
}else{
  finalData = latestData;

  localStorage.setItem(CACHE_KEY, JSON.stringify({
    version: latestData.version,
    data: latestData
  }));
}

window.__PROFILE_CACHE[phone] = finalData;

if(!window.__BG_REFRESH) window.__BG_REFRESH = {};

if(!window.__BG_REFRESH[phone]){
  window.__BG_REFRESH[phone] = true;

  setTimeout(()=>{
    fetch(`https://raw.githubusercontent.com/vidhwaan/${phone}/main/data.json`)
      .then(r => {
        if(!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then(newData => {
        if(newData.version !== finalData.version){

          localStorage.setItem(CACHE_KEY, JSON.stringify({
            version: newData.version,
            data: newData
          }));

          window.__PROFILE_CACHE[phone] = newData;

          // ✅ optional UI refresh (safe)
          if(document.visibilityState === "visible"){
            renderPage(newData, page);
          }
        }
      })
      .catch(()=>{});
  }, 2000);
}
   
renderPage(finalData, page);



}catch(e){
document.body.innerHTML = "Error loading profile";
}

}


/* =========================
   ROUTE HANDLER
========================= */

function renderPage(data, page){

if(page === "gallery") return renderGallery(data);
if(page === "videos") return renderVideos(data);
if(page === "about") return renderAbout(data);

renderHome(data);

}


/* =========================
   COMMON NAV
========================= */

function slugify(str){
return str.toLowerCase().replace(/\s+/g,"-");
}

function nav(data){

const slug = `${data.firstName}${data.lastName}${data.phone}`.toLowerCase();

/* GEO PATH */
const geoPath = `
${slugify(data.location.state)}/
${slugify(data.location.district)}/
${slugify(data.location.subdistrict)}/
${slugify(data.location.village)}/
${slugify(data.instrument)}/
${slug}
`.replace(/\n/g,"");

return `
<div style="margin-bottom:30px;display:flex;gap:16px;flex-wrap:wrap;">
<a href="/${geoPath}">Home</a>
<a href="/${geoPath}/gallery">Gallery</a>
<a href="/${geoPath}/videos">Videos</a>
<a href="/${geoPath}/about">About</a>
</div>
`;

}


/* =========================
   SEO HELPER
========================= */

function applySEO(title, description, data){

document.querySelectorAll("meta[name='description']").forEach(e=>e.remove());
document.querySelectorAll("meta[name='keywords']").forEach(e=>e.remove());
document.querySelectorAll("script[type='application/ld+json']").forEach(e=>e.remove());
document.querySelectorAll("link[rel='canonical']").forEach(e=>e.remove());
document.querySelectorAll("meta[property^='og:']").forEach(e=>e.remove());

const geo = `${data.location.village}, ${data.location.subdistrict}, ${data.location.district}, ${data.location.state}`;

const slug = `${data.firstName}${data.lastName}${data.phone}`.toLowerCase();
const canonicalUrl = `https://registry.vidhwaan.com/${slug}`;

/* TITLE */
document.title = `Vidhwaan | ${data.firstName} ${data.lastName} | ${data.instrument}`;

/* DESCRIPTION */
const meta = document.createElement("meta");
meta.name = "description";
meta.content = `${data.firstName} ${data.lastName} is a professional ${data.instrument} artist in ${geo}. Book now via Vidhwaan.`;
document.head.appendChild(meta);

/* KEYWORDS */
const keywords = document.createElement("meta");
keywords.name = "keywords";
keywords.content = `${data.instrument}, ${data.firstName}, ${geo}, vidhwaan`;
document.head.appendChild(keywords);

/* ✅ CANONICAL (VERY IMPORTANT) */
const link = document.createElement("link");
link.rel = "canonical";
link.href = canonicalUrl;
document.head.appendChild(link);

/* ✅ OPEN GRAPH (SOCIAL + GOOGLE BOOST) */
const ogTitle = document.createElement("meta");
ogTitle.setAttribute("property","og:title");
ogTitle.content = `${data.firstName} ${data.lastName} | ${data.instrument}`;
document.head.appendChild(ogTitle);

const ogDesc = document.createElement("meta");
ogDesc.setAttribute("property","og:description");
ogDesc.content = meta.content;
document.head.appendChild(ogDesc);

const ogUrl = document.createElement("meta");
ogUrl.setAttribute("property","og:url");
ogUrl.content = canonicalUrl;
document.head.appendChild(ogUrl);

const ogType = document.createElement("meta");
ogType.setAttribute("property","og:type");
ogType.content = "profile";
document.head.appendChild(ogType);

/* ✅ STRUCTURED DATA (ENHANCED) */
const script = document.createElement("script");
script.type = "application/ld+json";

script.innerHTML = JSON.stringify({
"@context":"https://schema.org",
"@type":"Person",
"name":`${data.firstName} ${data.lastName}`,
"url": canonicalUrl,
"jobTitle": data.instrument,
"address":{
"@type":"PostalAddress",
"addressLocality": data.location.village,
"addressRegion": data.location.district,
"addressCountry": "IN"
}
});

document.head.appendChild(script);

}





function formatName(str){
return str.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
}


function extractPincode(village){
const match = village.match(/\d{6}$/);
return match ? match[0] : "";
}


function getVillageName(str){
return str.split("-")[0].replace(/\b\w/g,c=>c.toUpperCase());
}



/* =========================
   HOME
========================= */

function renderHome(data){

applySEO(
`${data.firstName} ${data.lastName}`,
`${data.instrument} artist`,
data
);

const profileUrl = window.location.href;

const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${profileUrl}`;

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

let isInstalled = localStorage.getItem("PWA_INSTALLED") === "1";

/* 🔥 ONLY RESET IF USER REALLY UNINSTALLED */
if(!isStandalone && isInstalled){

  // wait small delay to confirm it's not install phase
  setTimeout(()=>{
    const stillStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if(!stillStandalone){
      localStorage.removeItem("PWA_INSTALLED");
    }
  }, 2000);
}
   
const content = `

<div class="hero">

<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">

<!-- PROFILE IMAGE -->
<img src="https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=1e3a8a&color=fff&size=200"
style="
border-radius:50%;
width:120px;
height:120px;
border:3px solid rgba(255,255,255,0.3);
box-shadow:0 0 40px rgba(59,130,246,0.6);
">

<div>

<h1>${data.firstName} ${data.lastName}</h1>

<div class="badge">${data.instrument}</div>

<!-- ❌ REMOVED SLUG ADDRESS -->

</div>

</div>

</div>


<!-- ✅ ADDRESS BOX (NEW) -->
<div class="card">

<h3>Location</h3>

<p style="line-height:1.8;color:#cbd5f5;">

${getVillageName(data.location.village)} Village<br>
${formatName(data.location.subdistrict)} Mandal<br>
${formatName(data.location.district)} District<br>
${formatName(data.location.state)}<br>
India - ${extractPincode(data.location.village)}

</p>

</div>


<!-- CONTACT -->
<div class="card">

<h3>Contact</h3>

<p><b>Phone:</b> ${data.phone}</p>

</div>


<!-- QR SECTION (UPGRADED DOWNLOAD) -->
<div class="card" style="text-align:center;">

<h3 style="margin-bottom:5px;">Scan & Share</h3>

<p style="color:#94a3b8;font-size:13px;">
Instant profile access
</p>

<div style="
background:white;
padding:15px;
border-radius:16px;
display:inline-block;
margin-top:10px;
">

<img src="${qr}" style="width:180px;" id="qrImage">

</div>

<br><br>

<button id="downloadQRBtn"
data-name="${data.firstName} ${data.lastName}"
data-instrument="${data.instrument}"
data-url="${profileUrl}"
style="
background:#1e40af;
padding:10px 16px;
border-radius:8px;
color:white;
border:none;
cursor:pointer;
">
Download Card
</button>

</div>




<!-- VIDHWAAN ECOSYSTEM -->
<div class="card">

<h3>Vidhwaan Ecosystem</h3>

<div style="display:flex;gap:10px;flex-wrap:wrap;">

<a href="https://vidhwaan.com" target="_blank"
style="background:#1e40af;padding:10px 14px;border-radius:8px;color:white;text-decoration:none;">
Vidhwaan Group
</a>

<a href="https://tech.vidhwaan.com" target="_blank"
style="background:#0ea5e9;padding:10px 14px;border-radius:8px;color:white;text-decoration:none;">
Vidhwaan Technology
</a>

<a href="https://foundation.vidhwaan.com" target="_blank"
style="background:#9333ea;padding:10px 14px;border-radius:8px;color:white;text-decoration:none;">
Vidhwaan Foundation
</a>

<a href="https://pellimelam.vidhwaan.com" target="_blank"
style="background:#f59e0b;padding:10px 14px;border-radius:8px;color:white;text-decoration:none;">
Vidhwaan PelliMelam
</a>

</div>

</div>




${(!isStandalone && !isInstalled) ? `

<div class="card">

<h3>Vidhwaan App</h3>

<div style="display:flex;gap:10px;flex-wrap:wrap;">

<button id="installAppBtn"
style="background:#2563eb;padding:10px 14px;border-radius:8px;color:white;border:none;cursor:pointer;">
Download
</button>

</div>

</div>

` : ""}



<!-- QUICK ACTIONS -->
<div class="card">

<h3>Vidhwaan Support</h3>



<div style="display:flex;gap:10px;flex-wrap:wrap;">


<a href="https://wa.me/919440246101"
style="background:#22c55e;padding:10px 14px;border-radius:8px;color:white;text-decoration:none;">
WhatsApp
</a>

</div>

</div>








`;

renderLayout(layout(data, content));



requestAnimationFrame(()=>{

initUI(data);



/* =========================
   PWA INIT (RUN ONCE)
========================= */

if(!window.__PWA_INIT){
  window.__PWA_INIT = true;

  window.addEventListener("beforeinstallprompt", (e)=>{
    e.preventDefault();
    window.__DEFERRED_PROMPT = e;
  });
}

/* 🔥 ADD EXACTLY HERE (STEP 2) */

if(!window.__PWA_INSTALLED_LISTENER){
  window.__PWA_INSTALLED_LISTENER = true;

  window.addEventListener("appinstalled", ()=>{
    localStorage.setItem("PWA_INSTALLED", "1");
  });
}



/* BUTTON */
const btnInstall = document.getElementById("installAppBtn");

if(btnInstall){
  btnInstall.onclick = async ()=>{
    const promptEvent = window.__DEFERRED_PROMPT;

    if(promptEvent){
      promptEvent.prompt(); // ✅ ONLY THIS
    }
  };
}



let link = document.querySelector("link[rel='manifest']");
if(!link){
  link = document.createElement("link");
  link.rel = "manifest";
  document.head.appendChild(link);
}

if("serviceWorker" in navigator && !window.__SW_REGISTERED){
  window.__SW_REGISTERED = true;
  navigator.serviceWorker.register("/sw.js");
}

   
/* 🔥 DYNAMIC PER USER */
link.href = `/manifest.json?name=${encodeURIComponent(data.firstName)}&start=${encodeURIComponent(window.location.pathname)}`;





   
   

const btn = document.getElementById("downloadQRBtn");

if(btn){
btn.onclick = function(){
downloadQR(
this.dataset.name,
this.dataset.instrument,
this.dataset.url,
data.phone
);
};
}

});


}



function downloadQR(name, instrument, url, phone){

const scale = 2;

const W = 600;
const H = 820;
const P = 30;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = W * scale;
canvas.height = H * scale;

ctx.scale(scale, scale);

// ================= BACKGROUND =================
ctx.fillStyle = "#ffffff";
ctx.fillRect(0,0,W,H);

// ================= HEADER =================
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillStyle = "#0f172a";
ctx.font = "bold 30px Inter";
ctx.fillText("VIDHWAAN IDENTITY", W/2, 60);

// GOLD LINE
ctx.fillStyle = "#d4af37";
ctx.fillRect(P, 95, W - (P*2), 2);

// ================= NAME =================
ctx.fillStyle = "#111827";
ctx.font = "bold 34px Inter";
ctx.fillText(name, W/2, 155);

// ================= ROLE =================
ctx.fillStyle = "#2563eb";
ctx.font = "20px Inter";
ctx.fillText(instrument, W/2, 195);

// ================= LAYOUT =================
const topEnd = 220;
const footerHeight = 180;
const availableHeight = H - topEnd - footerHeight;

const maxQR = W - (P * 2);
const qrSize = Math.min(maxQR * 0.78, availableHeight);

const qrX = (W - qrSize) / 2;
const qrY = topEnd;

// ================= QR BOX =================
ctx.beginPath();
ctx.roundRect(qrX, qrY, qrSize, qrSize, 22);
ctx.fillStyle = "#ffffff";
ctx.fill();

ctx.lineWidth = 2;
ctx.strokeStyle = "#d1d5db";
ctx.stroke();

// ================= FETCH QR =================
fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${url}`)
  .then(res => {
    if(!res.ok) throw new Error("QR fetch failed");
    return res.blob();
  })
  .then(blob => {

const img = new Image();
img.src = URL.createObjectURL(blob);

img.onload = function(){

const innerPadding = 20;

ctx.drawImage(
img,
qrX + innerPadding,
qrY + innerPadding,
qrSize - (innerPadding*2),
qrSize - (innerPadding*2)
);

// ================= FOOTER =================
const footerY = qrY + qrSize + 25;

// ID NUMBER (authority tone)
ctx.fillStyle = "#374151";
ctx.font = "bold 16px Inter";
ctx.fillText(`VID-${phone}`, W/2, footerY);

// COMMUNITY (primary footer identity)
ctx.fillStyle = "#111827";
ctx.font = "bold 22px Inter";
ctx.fillText("Vidhwaan Community", W/2, footerY + 40);

// TAGLINE
ctx.fillStyle = "#4b5563";
ctx.font = "15px Inter";
ctx.fillText("Tradition • Pride • Legacy", W/2, footerY + 70);

// DIVIDER (refined)
ctx.fillStyle = "#1f2937";
ctx.fillRect(P + 60, footerY + 95, W - (P*2) - 120, 1);

// WEBSITE (strong visibility)
ctx.fillStyle = "#1d4ed8";
ctx.font = "bold 18px Inter";
ctx.fillText("www.vidhwaan.com", W/2, footerY + 125);

// ================= DOWNLOAD =================
const link = document.createElement("a");
link.download = `${name}-vidhwaan-id.png`;
link.href = canvas.toDataURL("image/png", 1.0);
link.click();

};

});

}


/* =========================
   GALLERY
========================= */

function renderGallery(data){

const images = data.gallery || [];

const content = `

<h2>Gallery</h2>

<p style="color:#94a3b8;font-size:14px;margin-bottom:10px;">
Photos and event moments
</p>

<div class="grid">

${images.length ? images.map(img => `
<div class="card" style="padding:10px;">
  <div style="width:100%;aspect-ratio:1/1;overflow:hidden;border-radius:10px;">
    <img src="${img}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">
  </div>
</div>
`).join("") : Array(5).fill("").map(() => `
<div class="card" style="padding:10px;">
  <div style="
    width:100%;
    aspect-ratio:1/1;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(255,255,255,0.03);
    border-radius:10px;
    color:#64748b;
    font-size:13px;">
    No Image
  </div>
</div>
`).join("")}

</div>

${!images.length ? `
<div class="card" style="text-align:center;color:#94a3b8;">
To add photos, please contact Vidhwaan support (details on home page).
</div>
` : ""}

`;

renderLayout(layout(data, content));

requestAnimationFrame(()=>{
initUI(data);
});

}


function getEmbedUrl(url){
if(!url) return "";

if(url.includes("youtu.be/")){
return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1].split("?")[0];
}

if(url.includes("watch?v=")){
return "https://www.youtube.com/embed/" + url.split("watch?v=")[1].split("&")[0];
}

return url;
}


/* =========================
   VIDEOS
========================= */

function renderVideos(data){

const videos = data.videos || [];

const content = `

<h2>Videos</h2>

<p style="color:#94a3b8;font-size:14px;margin-bottom:10px;">
Performance highlights and recordings
</p>

<div class="grid">

${videos.length ? videos.map(v => `
<div class="card" style="padding:10px;">
  <div style="position:relative;width:100%;padding-top:56.25%;">
    <iframe src="${getEmbedUrl(v)}" loading="lazy"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
    allowfullscreen></iframe>
  </div>
</div>
`).join("") : Array(5).fill("").map(() => `
<div class="card" style="padding:10px;">
  <div style="
    width:100%;
    aspect-ratio:16/9;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(255,255,255,0.03);
    border-radius:10px;
    color:#64748b;
    font-size:13px;">
    No Video
  </div>
</div>
`).join("")}

</div>

${!videos.length ? `
<div class="card" style="text-align:center;color:#94a3b8;">
To add videos, please contact Vidhwaan support (details on home page).
</div>
` : ""}

`;

renderLayout(layout(data, content));

requestAnimationFrame(()=>{
initUI(data);
});

}

/* =========================
   ABOUT
========================= */

function renderAbout(data){

const content = `

<h2>About</h2>

<div class="card">

<p style="line-height:1.6;color:#cbd5f5;">

Hello, I am <b>${data.firstName} ${data.lastName}</b>, a dedicated and professional 
<b>${data.instrument}</b> artist based in 
<b>
${getVillageName(data.location.village)},
${formatName(data.location.subdistrict)},
${formatName(data.location.district)},
${formatName(data.location.state)}
</b>

</p>

<p style="line-height:1.6;color:#cbd5f5;">

I specialize in performing at weddings, cultural events, traditional ceremonies, and special occasions, bringing authentic musical experience to every event.

</p>

<p style="line-height:1.6;color:#cbd5f5;">

With passion and experience in my field, I aim to deliver high-quality performances that create memorable moments for every audience.

</p>

</div>


<div class="card">

<h3>Services</h3>

<ul style="color:#cbd5f5;line-height:1.8;padding-left:18px;">
<li>Wedding Performances</li>
<li>Cultural Events</li>
<li>Temple Programs</li>
<li>Private Functions</li>
</ul>

</div>


<div class="card">

<h3>Location</h3>

<p style="color:#cbd5f5;">
${getVillageName(data.location.village)} Village<br>
${formatName(data.location.subdistrict)} Mandal<br>
${formatName(data.location.district)} District<br>
${formatName(data.location.state)}<br>
India - ${extractPincode(data.location.village)}
</p>

</div>

`;

renderLayout(layout(data, content));
   
requestAnimationFrame(()=>{
initUI(data);
});

}


function initUI(data){

const btn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");

/* ===== MOBILE MENU ===== */
if(btn && menu){

btn.onclick = (e)=>{
e.stopPropagation();

const isOpen = menu.classList.toggle("active");

/* sync hamburger animation */
if(isOpen){
btn.classList.add("active");
}else{
btn.classList.remove("active");
}
};

}


/* ===== CLOSE ON OUTSIDE CLICK ===== */
if(!window.__NAV_INIT){
window.__NAV_INIT = true;

document.addEventListener("click",(e)=>{
if(menu && btn && !menu.contains(e.target) && !btn.contains(e.target)){
menu.classList.remove("active");
btn.classList.remove("active");
}
});

}

/* ===== NAVIGATION ===== */

const slug = `${data.firstName}${data.lastName}${data.phone}`
.toLowerCase()
.replace(/\s+/g,"");

const base = `/${slug}`;

const routes = {
navHome: base,
navGallery: `${base}/gallery`,
navVideos: `${base}/videos`,
navAbout: `${base}/about`,
mNavHome: base,
mNavGallery: `${base}/gallery`,
mNavVideos: `${base}/videos`,
mNavAbout: `${base}/about`
};

Object.entries(routes).forEach(([id, url])=>{
const el = document.getElementById(id);
if(!el) return;

el.onclick = (e)=>{
e.preventDefault();

/* CLOSE MENU */
menu.classList.remove("active");
btn.classList.remove("active");

/* ROUTE */
history.pushState({}, "", url);
initRouter();
};
});

}


