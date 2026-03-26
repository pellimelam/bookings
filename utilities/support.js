export function loadSupport(){

// ✅ detect profile page (robust)
const isProfile = window.location.pathname.match(/\d{10}/);

if(isProfile) return;

// ✅ prevent duplicate button
if(document.getElementById("supportBtn")) return;

const html = `
<a id="supportBtn"
href="https://wa.me/919440246101"
target="_blank"
style="
position:fixed;
bottom:20px;
right:20px;
width:56px;
height:56px;
background:#25D366;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
box-shadow:0 10px 25px rgba(0,0,0,0.3);
z-index:9999;
text-decoration:none;
">

<!-- WhatsApp SVG -->
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 24 24">
<path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.16 1.6 5.97L0 24l6.24-1.64a11.88 11.88 0 0 0 5.81 1.48h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.19-1.24-6.18-3.51-8.45zM12.06 21.5c-1.8 0-3.57-.48-5.11-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.9 9.9 0 0 1-1.52-5.29c0-5.5 4.47-9.97 9.97-9.97 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.92 7.04c0 5.5-4.47 9.97-9.97 9.97zm5.47-7.41c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.53-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.53.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.48.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.12-.27-.2-.57-.35z"/>
</svg>

</a>
`;

document.body.insertAdjacentHTML("beforeend", html);

}
