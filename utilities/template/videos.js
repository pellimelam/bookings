import { layout } from "./baseTemplate.js";

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

export function generateVideos(data){

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

return layout(data, content);
}
