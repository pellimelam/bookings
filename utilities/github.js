import { generateHome } from "./template/home.js";
import { generateGallery } from "./template/gallery.js";
import { generateVideos } from "./template/videos.js";
import { generateAbout } from "./template/about.js";

const API = "https://cold-haze-63a2.needfullfil.workers.dev/";

/* =========================
   CHECK REPO
========================= */
export async function checkRepo(phone){

const res = await fetch(API, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
action: "checkRepo",
phone
})
});

const data = await res.json();
return data.exists;

}


/* =========================
   CREATE REPO
========================= */
export async function createRepo(phone){

const res = await fetch(API, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
action: "createRepo",
phone
})
});

if(res.status !== 200) return "error";

return "created";

}


/* =========================
   PUSH FILE
========================= */
export async function pushFile(repo, path, content){

await fetch(API, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
action: "pushFile",
repo,
path,
content: btoa(unescape(encodeURIComponent(content)))
})
});

}


/* =========================
   CREATE USER SITE
========================= */
export async function createUserSite(data){

const { phone, uid } = data;
const repo = uid || phone; // fallback

const fullData = {
...data,
gallery:[],
videos:[],
about:""
};

/* SAVE DATA */
await pushFile(repo, "data.json", JSON.stringify(fullData, null, 2));

/* GENERATE PAGES */
await pushFile(repo, "index.html", generateHome(fullData));
await pushFile(repo, "gallery.html", generateGallery(fullData));
await pushFile(repo, "videos.html", generateVideos(fullData));
await pushFile(repo, "about.html", generateAbout(fullData));

}
