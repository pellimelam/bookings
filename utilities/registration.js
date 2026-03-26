let GEO = null;

let selected = {
nadaswaram:0,
dolu:0,
saxophone:0,
drum:0
};

function vidwaanRow(key,label){
return `
<div style="
display:flex;
align-items:center;
justify-content:space-between;
margin-bottom:12px;
">

<div style="display:flex;align-items:center;gap:10px;">
<img src="./${key}1.png" style="width:34px;height:34px;border-radius:6px;">
<span>${label}</span>
</div>

<div>
<button onclick="changeQty('${key}',-1)">−</button>
<span id="${key}Qty" style="margin:0 10px;">0</span>
<button onclick="changeQty('${key}',1)">+</button>
</div>

</div>
`;
}


export async function loadRegistration(){



const html = `

<section class="section" id="booking">

<div class="container" style="max-width:520px;margin:auto;">

<h2 style="
text-align:center;
font-size:26px;
margin-bottom:25px;
font-weight:600;
">
Book Vidhwaans
</h2>

<div class="card">

<div class="form-group">

<!-- LOCATION (KEEP SAME IDS) -->
<div class="field"><select id="state"></select></div>
<div class="field"><select id="district"></select></div>
<div class="field"><select id="subdistrict"></select></div>
<div class="field"><select id="village"></select></div>

<!-- USER DETAILS -->
<div class="field"><input id="name" placeholder="Your Name"></div>
<div class="field"><input id="phone" placeholder="Mobile Number"></div>

<!-- VIDHWAAN SELECTION -->
<div style="margin-top:15px">

${vidwaanRow("nadaswaram","Nadaswaram")}
${vidwaanRow("dolu","Dolu")}
${vidwaanRow("saxophone","Saxophone")}
${vidwaanRow("drum","Drum")}

</div>

<!-- DATE -->
<div class="field">
<input type="date" id="fromDate" onchange="updateSummary()">
</div>

<div class="field">
<input type="date" id="toDate" onchange="updateSummary()">
</div>

<!-- SUMMARY -->
<div id="summary" style="margin-top:15px;"></div>

<button class="btn btn-primary" style="margin-top:16px;width:100%;" onclick="bookNow()">
Book Now
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
updateSummary();

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






window.changeQty = function(type,delta){

selected[type] = Math.max(0, selected[type] + delta);

document.getElementById(type+"Qty").innerText = selected[type];

updateSummary();

}


function updateSummary(){

const fromInput = document.getElementById("fromDate");
const toInput = document.getElementById("toDate");

const from = fromInput.value;
const to = toInput.value;

let days = 0;

if(from && to){
const d1 = new Date(from);
const d2 = new Date(to);
days = Math.ceil((d2 - d1)/(1000*60*60*24)) + 1;
}

let items = Object.entries(selected)
.filter(([k,v])=>v>0)
.map(([k,v])=>{
const names = {
nadaswaram:"Nadaswaram",
dolu:"Dolu",
saxophone:"Saxophone",
drum:"Drum"
};
return `${names[k]} (${v})`;
})
.join(", ");

document.getElementById("summary").innerHTML = `
<b>Selected:</b> ${items || "None"}<br>
<b>Dates:</b> ${from || "-"} → ${to || "-"}<br>
<b>Days:</b> ${days}
`;

}

window.bookNow = async function(){

const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();

const state = document.getElementById("state").value;
const district = document.getElementById("district").value;
const subdistrict = document.getElementById("subdistrict").value;
const village = document.getElementById("village").value;

const from = document.getElementById("fromDate").value;
const to = document.getElementById("toDate").value;

if(!name || !phone || !from || !to){
alert("Please fill all details");
return;
}

if(!/^[6-9][0-9]{9}$/.test(phone)){
alert("Enter valid mobile number");
return;
}

let selectedList = Object.entries(selected)
.filter(([k,v])=>v>0);

if(selectedList.length === 0){
alert("Select at least one Vidhwaan");
return;
}

/* FORMAT MESSAGE */

const text = `
📢 NEW BOOKING

👤 Name: ${name}
📞 Phone: ${phone}

📍 Location:
${state} / ${district} / ${subdistrict} / ${village}

🎶 Vidhwaans:
${selectedList.map(([k,v])=>`${k} - ${v}`).join("\n")}

📅 Dates:
${from} → ${to}
`;

document.getElementById("result").innerText = "Sending...";

try{

await fetch("https://frosty-sun-54f1.needfullfil.workers.dev/",{
method:"POST",
headers:{
"Content-Type":"text/plain"
},
body:text
});

document.getElementById("result").innerHTML = "✅ Booking Sent Successfully";

}catch(e){
console.error(e);

document.getElementById("result").innerHTML = "❌ Failed. Try again.";

}

}


