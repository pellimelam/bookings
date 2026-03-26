import { layout } from "./baseTemplate.js";

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

export function generateHome(data){

const profileUrl = ""; // static version (router handles dynamic)

const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${profileUrl}`;

const content = `

<div class="hero">

<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">

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

</div>

</div>

</div>


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


<div class="card">

<h3>Contact</h3>

<p><b>Phone:</b> ${data.phone}</p>

</div>


<div class="card" style="text-align:center;">

<h3>Scan & Share</h3>

<div style="
background:white;
padding:15px;
border-radius:16px;
display:inline-block;
margin-top:10px;
">

<img src="${qr}" style="width:180px;">

</div>

</div>


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


<div class="card">

<h3>Vidhwaan Support</h3>

<a href="https://wa.me/919440246101"
style="background:#22c55e;padding:10px 14px;border-radius:8px;color:white;text-decoration:none;">
Contact Support
</a>

</div>

`;

return layout(data, content);
}
