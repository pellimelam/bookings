import { loadUserData, saveUserData } from "./editProfile.js";

export function loadEditUI(){

const html = `

<section class="section">

<div class="container" style="max-width:600px;margin:auto;">

<h2 style="text-align:center;margin-bottom:20px;">Edit Your Profile</h2>

<div class="card">

<input id="editPhone" placeholder="Enter your mobile number">

<button class="btn btn-primary" onclick="loadProfile()">Load Profile</button>

<div id="editForm" style="margin-top:20px;display:none;">

<h3>Gallery (5 images)</h3>
${[1,2,3,4,5].map(i=>`<input id="img${i}" placeholder="Image ${i} URL">`).join("")}

<h3>Videos (5 YouTube URLs)</h3>
${[1,2,3,4,5].map(i=>`<input id="vid${i}" placeholder="Video ${i} URL">`).join("")}

<h3>About</h3>
<textarea id="aboutText" placeholder="About you"></textarea>

<button class="btn btn-primary" onclick="saveProfile()">Save</button>

</div>

</div>

</div>

</section>

`;

document.getElementById("edit").innerHTML = html;

}


/* =========================
   LOAD PROFILE
========================= */
window.loadProfile = async function(){

const phone = document.getElementById("editPhone").value.trim();

if(!phone){
alert("Enter phone number");
return;
}

const data = await loadUserData(phone);

if(!data) return;

window.__PROFILE__ = data;

/* FILL */

data.gallery.forEach((v,i)=>{
document.getElementById(`img${i+1}`).value = v;
});

data.videos.forEach((v,i)=>{
document.getElementById(`vid${i+1}`).value = v;
});

document.getElementById("aboutText").value = data.about;

document.getElementById("editForm").style.display = "block";

};


/* =========================
   SAVE PROFILE
========================= */
window.saveProfile = async function(){

const data = window.__PROFILE__;

data.gallery = [1,2,3,4,5].map(i=>document.getElementById(`img${i}`).value);
data.videos = [1,2,3,4,5].map(i=>document.getElementById(`vid${i}`).value);
data.about = document.getElementById("aboutText").value;

await saveUserData(data);

alert("Updated successfully 🚀");

};
