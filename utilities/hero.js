export function loadHero(){

const hero = `

<section class="hero">

<img src="./icons1/logo.png" class="logo" alt="Vidhwaan Logo">

<h1>Vidhwaan Community</h1>

<p>Official Vidhwaan Registration Platform</p>

<div class="hero-buttons">

<a class="btn btn-primary" href="#registration">
Start Registration
</a>

<a class="btn btn-outline" href="https://pellimelam.vidhwaan.com">
Explore PelliMelam
</a>

</div>

</section>

`

document.getElementById("hero").innerHTML = hero

}
