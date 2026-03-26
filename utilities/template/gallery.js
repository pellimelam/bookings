import { layout } from "./baseTemplate.js";

export function generateGallery(data){

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
    <img src="${img}" loading="lazy"
    style="width:100%;height:100%;object-fit:cover;">
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

return layout(data, content);
}
