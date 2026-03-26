export function loadNav(){

const nav = `

<header class="nav">

<div class="nav-inner">

<div class="nav-left">
<span class="brand">Vidhwaan</span>
</div>

<!-- HAMBURGER -->
<div class="nav-toggle" id="navToggle">
<span></span>
<span></span>
<span></span>
</div>

<nav class="nav-links" id="navLinks">

<a href="https://vidhwaan.com">Home</a>
<a href="https://pellimelam.vidhwaan.com">PelliMelam</a>
<a href="https://tech.vidhwaan.com">Technology</a>
<a href="https://foundation.vidhwaan.com">Foundation</a>

</nav>

</div>

</header>

`;

const navRoot = document.getElementById("nav");
if(!navRoot) return;

navRoot.innerHTML = nav;

// 🔥 DELAY BINDING (CRITICAL FOR DYNAMIC DOM)
requestAnimationFrame(() => {

const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

if(!toggle || !links) return;

// ✅ PREVENT DUPLICATE EVENTS
toggle.onclick = null;
document.onclick = null;

// TOGGLE MENU
toggle.onclick = (e) => {
e.stopPropagation();

links.classList.toggle("active");
toggle.classList.toggle("active"); // optional for animation
};

// CLOSE ON OUTSIDE CLICK
document.onclick = (e) => {
if(!links.contains(e.target) && !toggle.contains(e.target)){
links.classList.remove("active");
toggle.classList.remove("active");
}
};

});

}
