---
title: "Theorie om te luisteren"
description: "De zweefvliegtheorie als podcast: per vak één aflevering van ongeveer een uur."
robots: "noindex, nofollow"
_build:
  list: never
  render: always
---

<!-- Gegenereerd door build-podcast.js in de repo zcflevo-theorievideos; niet met de hand aanpassen. -->

De theorie ook gewoon luisteren, in de auto of onderweg: per vak één aflevering van ongeveer een uur, waarin alle stof zit. Met de hoofdstukken spring je naar het onderwerp dat je wilt horen.

**Abonneren in je podcast-app:** tik op je telefoon op de knop van je app. Nieuwe vakken verschijnen dan vanzelf.

<p class="podcast-apps">
<a class="podcast-app" href="podcast://zcflevo.nl/spl-theorie/podcast/feed.xml">Apple Podcasts</a>
<a class="podcast-app" href="overcast://x-callback-url/add?url=https%3A%2F%2Fzcflevo.nl%2Fspl-theorie%2Fpodcast%2Ffeed.xml">Overcast</a>
<a class="podcast-app" href="pktc://subscribe/zcflevo.nl/spl-theorie/podcast/feed.xml">Pocket Casts</a>
<button type="button" class="podcast-app" id="podcast-kopieer">Kopieer feed-adres</button>
</p>

Werkt de knop niet, of gebruik je een andere app? Voeg de show dan toe via "Volg show via URL" (in Apple Podcasts: Bibliotheek, de drie puntjes rechtsboven) met dit adres:

<p><code>https://zcflevo.nl/spl-theorie/podcast/feed.xml</code></p>

> Gebaseerd op de lesstof van Dirk Corporaal op [zweefvliegopleiding.nl](https://zweefvliegopleiding.nl/index.php/spl). Ingesproken met een computerstem.

## 2. Menselijke prestaties en beperkingen

<div class="podcast-aflevering">
<h3>Menselijke prestaties in een uur</h3>
<p>53 minuten · 27 hoofdstukken · <a href="{{< url "/spl-theorie/podcast/afleveringen/2-compact-menselijk.mp3" >}}" download>download</a></p>
<audio controls preload="none" src="{{< url "/spl-theorie/podcast/afleveringen/2-compact-menselijk.mp3" >}}"></audio>
<details><summary>Hoofdstukken</summary><ol><li><button type="button" class="podcast-sprong" data-t="0">00:00</button> Waarom dit vak</li><li><button type="button" class="podcast-sprong" data-t="56">00:56</button> Waar het misgaat</li><li><button type="button" class="podcast-sprong" data-t="240">04:01</button> In welke fase, en wat je ervan leert</li><li><button type="button" class="podcast-sprong" data-t="380">06:20</button> Recente ervaring en risico</li><li><button type="button" class="podcast-sprong" data-t="530">08:50</button> Het monument op de Wasserkuppe</li><li><button type="button" class="podcast-sprong" data-t="585">09:45</button> Je lichaam op de keuring</li><li><button type="button" class="podcast-sprong" data-t="739">12:20</button> Hart en bloed</li><li><button type="button" class="podcast-sprong" data-t="824">13:45</button> De lucht boven je</li><li><button type="button" class="podcast-sprong" data-t="942">15:43</button> Ademhaling, zuurstoftekort en de T.U.C.</li><li><button type="button" class="podcast-sprong" data-t="1109">18:29</button> De zuurstofinstallatie</li><li><button type="button" class="podcast-sprong" data-t="1184">19:45</button> Hyperventilatie</li><li><button type="button" class="podcast-sprong" data-t="1258">20:58</button> Decompressieziekte en G-krachten</li><li><button type="button" class="podcast-sprong" data-t="1385">23:05</button> Je ogen</li><li><button type="button" class="podcast-sprong" data-t="1565">26:06</button> Uitkijken en landingsillusies</li><li><button type="button" class="podcast-sprong" data-t="1679">27:59</button> Je oren</li><li><button type="button" class="podcast-sprong" data-t="1784">29:45</button> Evenwicht en desoriëntatie</li><li><button type="button" class="podcast-sprong" data-t="1905">31:45</button> Draai-illusies en luchtziekte</li><li><button type="button" class="podcast-sprong" data-t="2092">34:53</button> Fit om te vliegen: I'M SAFE</li><li><button type="button" class="podcast-sprong" data-t="2205">36:45</button> Alcohol, drugs, eten en drinken</li><li><button type="button" class="podcast-sprong" data-t="2337">38:58</button> Je hart sparen en vermoeidheid</li><li><button type="button" class="podcast-sprong" data-t="2395">39:55</button> Hoe je hoofd informatie verwerkt</li><li><button type="button" class="podcast-sprong" data-t="2505">41:46</button> Besluiten en situational awareness</li><li><button type="button" class="podcast-sprong" data-t="2675">44:36</button> Stress</li><li><button type="button" class="podcast-sprong" data-t="2847">47:27</button> De keten van fouten</li><li><button type="button" class="podcast-sprong" data-t="2985">49:46</button> Oefenen en gevaarlijke houdingen</li><li><button type="button" class="podcast-sprong" data-t="3108">51:48</button> Tot slot</li><li><button type="button" class="podcast-sprong" data-t="3144">52:25</button> Aftiteling</li></ol></details>
</div>

<script>
document.getElementById("podcast-kopieer").addEventListener("click", function () {
  var knop = this;
  navigator.clipboard.writeText("https://zcflevo.nl/spl-theorie/podcast/feed.xml").then(function () {
    knop.textContent = "Gekopieerd";
  });
});
document.querySelectorAll(".podcast-sprong").forEach(function (knop) {
  knop.addEventListener("click", function () {
    var speler = knop.closest(".podcast-aflevering").querySelector("audio");
    speler.currentTime = Number(knop.dataset.t);
    speler.play();
  });
});
</script>

<style>
.podcast-apps { display: flex; flex-wrap: wrap; gap: .5rem; }
.podcast-app { font: inherit; display: inline-block; padding: .5rem 1rem; border-radius: 999px; background: var(--blue); color: #fff; border: 0; text-decoration: none; cursor: pointer; }
.podcast-aflevering { margin: 0 0 2rem; }
.podcast-aflevering audio { width: 100%; }
.podcast-aflevering h3 { margin-bottom: .25rem; }
.podcast-aflevering ol { padding-left: 1.25rem; }
.podcast-sprong { font: inherit; color: var(--blue); background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; min-width: 3.5rem; text-align: left; }
</style>
