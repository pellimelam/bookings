import { pushFile } from "./github.js";
import { generateHome } from "./template/home.js";
import { generateGallery } from "./template/gallery.js";
import { generateVideos } from "./template/videos.js";
import { generateAbout } from "./template/about.js";

const ORG = "vidhwaan";

/* =========================
   LOAD USER DATA
========================= */
export async function loadUserData(phone){

const res = await fetch(`https://raw.githubusercontent.com/${ORG}/${phone}/main/data.json`);

if(!res.ok){
alert("Profile not found");
return null;
}

return await res.json();

}


/* =========================
   SAVE USER DATA
========================= */
export async function saveUserData(data){

const { phone } = data;

/* SAVE JSON */

await pushFile(phone, "data.json", JSON.stringify(data, null, 2));

/* REGENERATE PAGES */

await pushFile(phone, "index.html", generateHome(data));
await pushFile(phone, "gallery.html", generateGallery(data));
await pushFile(phone, "videos.html", generateVideos(data));
await pushFile(phone, "about.html", generateAbout(data));

}
