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
<img src="./${key}1.png" loading="lazy" style="width:34px;height:34px;border-radius:6px;">
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
<div class="field"><input id="phone" placeholder="Mobile Number" maxlength="10" oninput="validatePhone(this)"></div>

<!-- VIDHWAAN SELECTION -->
<div style="margin-top:15px">

${vidwaanRow("nadaswaram","Nadaswaram")}
${vidwaanRow("dolu","Dolu")}
${vidwaanRow("saxophone","Saxophone")}
${vidwaanRow("drum","Drum")}

</div>

<!-- DATE -->
<!-- DATE -->
<div class="field" style="position:relative;">
<label style="
position:absolute;
top:-8px;
left:12px;
font-size:11px;
opacity:0.7;
background:#0f172a;
padding:0 6px;
border-radius:4px;
">
From
</label>
<input type="date" id="fromDate">
</div>

<div class="field" style="position:relative;">
<label style="
position:absolute;
top:-8px;
left:12px;
font-size:11px;
opacity:0.7;
background:#0f172a;
padding:0 6px;
border-radius:4px;
">
To
</label>
<input type="date" id="toDate">
</div>

<!-- SUMMARY -->
<div id="summary" style="margin-top:15px;"></div>

<button class="btn btn-primary" style="margin-top:16px;width:100%;" onclick="bookNow()">
Book Now
</button>

<button id="installBtn" class="btn btn-primary" style="margin-top:10px;width:100%;display:none;">
Download App
</button>


<div id="result" style="margin-top:12px;text-align:center;"></div>

</div>

</div>

</section>

`;


document.getElementById("registration").innerHTML = html;

loadGeo().then(() => {
  initState();
});
   
updateSummary();

document.getElementById("fromDate").addEventListener("change", updateSummary);
document.getElementById("toDate").addEventListener("change", updateSummary);

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

  try {

    const responses = await Promise.all(
      files.map(f => fetch(f).then(r => r.json()))
    );

    GEO = Object.assign({}, ...responses);

    console.log("⚡ GEO INSTANT LOADED:", Object.keys(GEO).length);

  } catch(e){
    console.error("❌ GEO LOAD FAILED", e);
  }
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
   
if(!document.getElementById("fromDate")) return;
   
const fromInput = document.getElementById("fromDate");
const toInput = document.getElementById("toDate");

const from = fromInput.value;
const to = toInput.value;

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

if(!from || !to){
document.getElementById("summary").innerHTML = `
<b>Selected:</b> ${items || "None"}<br>
<b>Dates:</b> - → -<br>
<b>Days:</b> 0
`;
return;
}

let days = 0;

const d1 = new Date(from);
const d2 = new Date(to);
days = Math.ceil((d2 - d1)/(1000*60*60*24)) + 1;

document.getElementById("summary").innerHTML = `
<b>Selected:</b> ${items || "None"}<br>
<b>Dates:</b> ${formatDate(from)} → ${formatDate(to)}<br>
<b>Days:</b> ${days}
`;

}





function formatDate(d){
const [y,m,day] = d.split("-");
return `${day}-${m}-${y}`;
}

window.bookNow = async function(){

const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();

const stateKey = document.getElementById("state").value;
const districtKey = document.getElementById("district").value;
const subKey = document.getElementById("subdistrict").value;
const villageSlug = document.getElementById("village").value;

const stateName = GEO[stateKey]?.name || "";
const districtName = GEO[stateKey]?.districts[districtKey]?.name || "";
const subName = GEO[stateKey]?.districts[districtKey]?.subdistricts[subKey]?.name || "";

let villageName = "";
let pincode = "";

const villages = GEO[stateKey]?.districts[districtKey]?.subdistricts[subKey]?.villages || [];

const v = villages.find(x => x.slug === villageSlug);

if(v){
villageName = v.name;
pincode = v.pincode;
}


const from = document.getElementById("fromDate").value;
const to = document.getElementById("toDate").value;

const d1 = new Date(from);
const d2 = new Date(to);
const days = Math.ceil((d2 - d1)/(1000*60*60*24)) + 1;

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
${villageName} Village, ${subName} Mandal, ${districtName} District, ${stateName} - ${pincode}

🎶 Vidhwaans:
${selectedList.map(([k,v])=>`${k} - ${v}`).join("\n")}

📅 Dates:
${from} → ${to} (${days} days)
`;

document.getElementById("result").innerText = "Sending...";

try{

await fetch("https://frosty-sun-54f1.needfullfil.workers.dev/", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
message: text
})
});

document.getElementById("result").innerHTML = "✅ Booking Sent Successfully";

}catch(e){
console.error(e);

document.getElementById("result").innerHTML = "❌ Failed. Try again.";

}

}

window.validatePhone = function(input){

input.value = input.value.replace(/\D/g, ""); // only numbers

if(input.value.length > 10){
input.value = input.value.slice(0,10);
}

if(input.value.length === 10){
input.style.border = "1px solid #22c55e"; // green
}else{
input.style.border = "1px solid #ef4444"; // red
}

}


let deferredPrompt;

const installBtnHandler = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;

    const btn = document.getElementById("installBtn");
    if (btn) btn.style.display = "none";
  }
};

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const btn = document.getElementById("installBtn");
  if (btn) {
    btn.style.display = "block";
    btn.onclick = installBtnHandler;
  }
});

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installBtn");
  if (btn) btn.style.display = "none";
});
