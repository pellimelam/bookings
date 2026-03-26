export function layout(data, inner){

return `

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Loading...</title>

<!-- ✅ FAVICON -->
<link rel="icon" href="https://registry.vidhwaan.com/favicon.ico">

</head>
<body>
<style>

/* ===== GLOBAL ===== */
body{
margin:0;
font-family: Inter, system-ui;
background: radial-gradient(circle at top, #1e3a8a, #020617);
color:white;
}

/* ===== NAV ===== */

.nav{
position:fixed;
top:0;
left:0;
width:100%;
display:flex;
justify-content:space-between;
align-items:center;
padding:12px 24px;
background:linear-gradient(90deg,#1e3a8a,#0f172a);
z-index:3000;
box-sizing:border-box;
border-bottom:1px solid rgba(255,255,255,0.08);
}

.nav img{
width:auto !important;
height:32px;
}

.logo{
font-weight:700;
font-size:18px;
}

.nav-links{
display:flex;
gap:20px;
}

.nav-links a{
color:#cbd5f5;
text-decoration:none;
}

/* MOBILE */
.menu-btn{
display:none;
width:28px;
height:22px;
position:relative;
cursor:pointer;
}

.menu-btn span{
position:absolute;
left:0;
width:100%;
height:2.5px;

background:linear-gradient(90deg,#fff,#cbd5f5);
border-radius:3px;

transition:0.3s;
}

.menu-btn span:nth-child(1){ top:0; }
.menu-btn span:nth-child(2){ top:8px; }
.menu-btn span:nth-child(3){ top:16px; }


.menu-btn.active span:nth-child(1){
transform: rotate(45deg);
top:8px;
}

.menu-btn.active span:nth-child(2){
opacity:0;
}

.menu-btn.active span:nth-child(3){
transform: rotate(-45deg);
top:8px;
}

/* ===== MOBILE MENU (FINAL FIX) ===== */
.mobile-menu{
position:fixed;
top:0;
right:0;
width:280px;
height:100vh;

/* 🔥 PREMIUM GLASS */
background: rgba(15, 23, 42, 0.75);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);

/* depth */
box-shadow: -20px 0 50px rgba(0,0,0,0.6);

transform:translateX(100%);
transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

display:flex;
flex-direction:column;
padding-top:80px;

z-index:2000;
}

.mobile-menu::before{
content:"";
position:absolute;
top:0;
left:0;
width:2px;
height:100%;
background:linear-gradient(to bottom, #3b82f6, transparent);
opacity:0.4;
}

.mobile-menu.active{
transform:translateX(0);
}

.mobile-menu a{
color:#e2e8f0;
font-size:16px;
font-weight:500;

padding:18px 22px;
margin:4px 10px;
border-radius:10px;

transition: all 0.25s ease;
}

.mobile-menu a:hover{
background:rgba(59,130,246,0.15);
color:#fff;
transform:translateX(6px);
}

.mobile-menu a.active{
background:rgba(59,130,246,0.25);
color:#fff;
box-shadow:0 0 10px rgba(59,130,246,0.3);
}


.mobile-menu.active{
transform:translateX(0);
}

/* ===== CONTAINER ===== */
.container{
max-width:1000px;
margin:auto;
padding:90px 20px 30px; /* 👈 push content below fixed navbar */
}

/* ===== HERO ===== */
.hero h1{
font-size:34px;
margin:10px 0;
}

.badge{
background:#1e40af;
padding:6px 12px;
border-radius:20px;
display:inline-block;
font-size:12px;
}

.location{
color:#94a3b8;
}

/* ===== CARD ===== */
.card{
background:rgba(255,255,255,0.05);
border:1px solid rgba(255,255,255,0.1);
padding:20px;
border-radius:14px;
margin-top:20px;
}

/* ===== GRID ===== */
.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:15px;
margin-top:20px;
}

/* ===== MEDIA ===== */
img{
width:100%;
border-radius:10px;
}

iframe{
width:100%;
height:200px;
border:none;
border-radius:10px;
}

/* ===== FOOTER ===== */
.footer{
margin-top:40px;
padding:20px;
text-align:center;
color:#94a3b8;
border-top:1px solid #1e293b;
}

/* ===== RESPONSIVE ===== */
@media(max-width:768px){
.nav-links{display:none;}
.menu-btn{display:block;}
}


/* FLOATING BUTTONS */
.floating{
position:fixed;
bottom:20px;
right:20px;
display:flex;
flex-direction:column;
gap:10px;
z-index:3000;
}

.float-btn{
width:50px;
height:50px;
display:flex;
align-items:center;
justify-content:center;
border-radius:50%;
color:white;
font-size:20px;
text-decoration:none;
box-shadow:0 8px 20px rgba(0,0,0,0.3);
}

.call{background:#16a34a;}
.whatsapp{background:#22c55e;}


</style>


<!-- NAV -->
<div class="nav">

<div class="logo" style="display:flex;align-items:center;gap:10px;">

<img src="https://registry.vidhwaan.com/icons1/logo.png"
style="height:32px;width:auto;display:block;max-width:none;">

<span style="font-weight:700;font-size:18px;color:white;">
Vidhwaan
</span>

</div>

<div class="nav-links">
<a href="#" id="navHome">Home</a>
<a href="#" id="navGallery">Gallery</a>
<a href="#" id="navVideos">Videos</a>
<a href="#" id="navAbout">About</a>
</div>

<div class="menu-btn" id="menuBtn">
<span></span>
<span></span>
<span></span>
</div>
</div>

<div id="mobileMenu" class="mobile-menu">
<a href="#" id="mNavHome">Home</a>
<a href="#" id="mNavGallery">Gallery</a>
<a href="#" id="mNavVideos">Videos</a>
<a href="#" id="mNavAbout">About</a>
</div>


<!-- CONTENT -->
<div class="container">
${inner}
</div>


<div class="floating">

<a href="tel:${data.phone}" class="float-btn call">📞</a>

<a href="https://wa.me/91${data.phone}" class="float-btn whatsapp">

<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
<path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.16 1.6 5.97L0 24l6.24-1.64a11.88 11.88 0 0 0 5.81 1.48h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.19-1.24-6.18-3.51-8.45zM12.06 21.5c-1.8 0-3.57-.48-5.11-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.9 9.9 0 0 1-1.52-5.29c0-5.5 4.47-9.97 9.97-9.97 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.92 7.04c0 5.5-4.47 9.97-9.97 9.97zm5.47-7.41c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.53-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.53.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.48.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.12-.27-.2-.57-.35z"/>
</svg>

</a>

</div>



<!-- FOOTER -->
<div class="footer">
© Vidhwaan Group • Culture • Technology • Impact
</div>





</body>
</html>

`;
}
