let GEO = null;

export async function loadRegistration(){

const html = `

<section class="section" id="registration">

<div class="container" style="max-width:520px;margin:auto;">

<h2 style="
text-align:center;
font-size:26px;
margin-bottom:25px;
font-weight:600;
">
Register as Vidhwaan
</h2>

<div class="card">

<div class="form-group">

<div class="field"><select id="state"></select></div>
<div class="field"><select id="district"></select></div>
<div class="field"><select id="subdistrict"></select></div>
<div class="field"><select id="village"></select></div>

<div class="field"><input id="firstName" placeholder="First Name"></div>
<div class="field"><input id="lastName" placeholder="Last Name"></div>
<div class="field"><input id="phone" placeholder="Mobile Number"></div>

<div class="field">
<select id="instrument">
<option value="">Select Instrument</option>
<option>Nadaswaram</option>
<option>Dolu</option>
<option>Saxophone</option>
<option>Drum</option>
</select>
</div>

<button class="btn btn-primary" style="margin-top:16px;width:100%;" onclick="registerUser()">
Register
</button>

<div id="result" style="margin-top:12px;text-align:center;"></div>

</div>

</div>

</section>

`;

document.getElementById("registration").innerHTML = html;

/* LOAD GEO */
await loadGeo();

/* INIT DROPDOWN */
initState();

}


/* =========================
   LOAD JSON DATA
========================= */

async function loadGeo(){

if(GEO) return;

const files = [
"./geo_dataset_1.json",
"./geo_dataset_2.json",
"./geo_dataset_3.json",
"./geo_dataset_4.json"
];

let merged = {};

for(const file of files){

try{

const res = await fetch(file);

if(!res.ok){
console.error("❌ JSON NOT FOUND:", file);
continue;
}

const data = await res.json();

/* merge all */
Object.assign(merged, data);

}catch(err){
console.error("❌ ERROR LOADING:", file, err);
}

}

GEO = merged;

console.log("✅ GEO LOADED:", Object.keys(GEO).length);

}


/* =========================
   STATE
========================= */

function initState(){

const el = document.getElementById("state");

el.innerHTML = `<option value="">Select State</option>`;

Object.keys(GEO).forEach(key=>{
el.innerHTML += `<option value="${key}">${GEO[key].name}</option>`;
});

el.onchange = () => loadDistrict(el.value);

}


/* =========================
   DISTRICT
========================= */

function loadDistrict(stateKey){

const el = document.getElementById("district");
el.innerHTML = `<option value="">Select District</option>`;

if(!stateKey) return;

const districts = GEO[stateKey].districts;

Object.keys(districts).forEach(key=>{
el.innerHTML += `<option value="${key}">${districts[key].name}</option>`;
});

el.onchange = () => loadSubdistrict(stateKey, el.value);

}


/* =========================
   SUBDISTRICT
========================= */

function loadSubdistrict(stateKey, districtKey){

const el = document.getElementById("subdistrict");
el.innerHTML = `<option value="">Select Subdistrict</option>`;

if(!districtKey) return;

const subs = GEO[stateKey].districts[districtKey].subdistricts;

Object.keys(subs).forEach(key=>{
el.innerHTML += `<option value="${key}">${subs[key].name}</option>`;
});

el.onchange = () => loadVillage(stateKey, districtKey, el.value);

}


/* =========================
   VILLAGE
========================= */

function loadVillage(stateKey, districtKey, subKey){

const el = document.getElementById("village");
el.innerHTML = `<option value="">Select Village</option>`;

if(!subKey) return;

const villages =
GEO[stateKey]
.districts[districtKey]
.subdistricts[subKey]
.villages;

villages.forEach(v=>{
el.innerHTML += `
<option value="${v.slug}">
${v.name} (${v.pincode})
</option>`;
});

}
