# Handleiding: website bewerken via GitHub

*Voor clubleden van Zweefvliegclub Flevo*

---

Deze handleiding legt uit hoe je als clublid aanpassingen aan de website
kunt doen: een typfout corrigeren, een foto vervangen, een nieuw
lidverhaal toevoegen. Dat kan op **twee manieren**:

1. **Vraag het aan de AI (de makkelijkste manier):** je schrijft in gewoon
   Nederlands wat er anders moet, en Claude, onze AI-assistent, voert het
   uit. Jij hoeft alleen het resultaat te controleren en op de groene knop
   te drukken. Zie [Manier 1](#manier-1-vraag-het-aan-de-ai).
2. **Zelf bewerken via GitHub:** je past de tekstbestanden zelf aan in je
   browser. Handig voor kleine typfoutjes of als je precies weet wat je
   wilt. Zie [Manier 2](#manier-2-zelf-bewerken-via-github).

Geen technische voorkennis nodig. Als je een e-mail kunt schrijven, kun
je dit ook.

> 💡 **Tip:** Niets is onherstelbaar. Alles wat je doet wordt automatisch
> opgeslagen als "stapje" in de geschiedenis. Iets per ongeluk kapot
> gemaakt? Dat draaien we zo terug. Lees gerust verder en probeer dingen uit.

📄 **Word-versie**: een geprinte/Word-versie van deze handleiding staat als
[`Handleiding-website-bewerken.docx`](./Handleiding-website-bewerken.docx)
in deze repo.

---

## Inhoudsopgave

1. [Wat je nodig hebt](#wat-je-nodig-hebt)
2. [Manier 1: vraag het aan de AI](#manier-1-vraag-het-aan-de-ai)
3. [Manier 2: zelf bewerken via GitHub](#manier-2-zelf-bewerken-via-github)
4. [Hoe werkt dit eigenlijk?](#hoe-werkt-dit-eigenlijk)
5. [Tekst aanpassen op een bestaande pagina](#tekst-aanpassen-op-een-bestaande-pagina)
6. [Een foto vervangen of toevoegen](#een-foto-vervangen-of-toevoegen)
7. [Een nieuw lidverhaal toevoegen](#een-nieuw-lidverhaal-toevoegen)
8. [Markdown: korte uitleg](#markdown-korte-uitleg)
9. [Shortcodes: stukjes die automatisch worden ingevuld](#shortcodes-stukjes-die-automatisch-worden-ingevuld)
10. [Wat je beter NIET kunt aanpassen](#wat-je-beter-niet-kunt-aanpassen)
11. [Veelgestelde vragen](#veelgestelde-vragen)
12. [Onder de motorkap: hoe werkt het technisch?](#onder-de-motorkap-hoe-werkt-het-technisch)
13. [Hulp nodig?](#hulp-nodig)

---

## Wat je nodig hebt

1. Een **GitHub-account**: gratis, registreer eenmalig op
   [github.com/signup](https://github.com/signup)
2. **Toegang tot de ZC Flevo repository**: vraag Evert Dieperink om je
   GitHub-gebruikersnaam toe te voegen als medewerker
   ([evert.dieperink@zcflevo.nl](mailto:evert.dieperink@zcflevo.nl))
3. Een **moderne browser** (Chrome, Edge, Firefox, Safari)

Je hoeft niets te installeren. Geen code, geen terminal, geen Git client.
Alles gebeurt in je browser. Dit geldt voor allebei de manieren hieronder.

---

## Manier 1: vraag het aan de AI

Je hoeft niet zelf in bestanden te graven: je kunt elke wijziging gewoon
**in het Nederlands aanvragen**. Claude, onze AI-assistent, leest je
verzoek, past de website aan volgens de huisstijl en zet het resultaat
voor je klaar. Jij controleert het en keurt het goed.

### Stap 1: open een issue

Ga naar het tabblad
[**Issues**](https://github.com/EvertDieperink/zcflevo-site/issues) en
klik op **New issue**.

### Stap 2: schrijf wat je wilt, met @claude erin

Geef een korte titel en schrijf in het grote tekstvak wat er moet
gebeuren. **Zet er `@claude` in**, anders gebeurt er niets. Wees zo
concreet mogelijk: noem de pagina en wat er moet veranderen.

Voorbeelden:

> @claude op de FAQ-pagina staat dat we op zondag rond 20:00 stoppen;
> maak daar "rond zonsondergang" van.

> @claude verplaats in de jaarkalender de ALV naar zaterdag 7 maart.

> @claude voeg dit verhaal van Piet toe aan de pagina Leden vertellen:
> (plak hier de tekst)

Klik daarna op **Create** (de groene knop).

### Stap 3: wacht een paar minuten en klik "Create PR"

Claude reageert in het issue en gaat aan de slag. Als hij klaar is staat
er in zijn reactie een link **"Create PR ➔"**. Klik daarop en daarna op
de groene knop **Create pull request**. Daarmee maak je het
wijzigingsvoorstel aan; er staat dan nog **niets** live.

### Stap 4: controleren en goedkeuren

Open in de pull request het tabblad **Files changed**: rood is
wat weggaat, groen is wat erbij komt.

- **Goed?** Klik op **Merge pull request** en daarna **Confirm merge**.
  Na 1 à 2 minuten staat de wijziging live op
  [zcflevo.nl](https://zcflevo.nl).
- **Bijna goed?** Schrijf in de pull request een comment met je feedback,
  weer met @claude erin, bijvoorbeeld *"@claude maak de tekst wat
  korter"*. Claude past het voorstel dan aan.
- **Niet goed?** Klik onderaan op **Close pull request**. Er gebeurt dan
  niets; de site blijft zoals hij was.

> 💡 **Goed om te weten:** de AI kan nooit zelf iets op de site zetten.
> Er gaat pas iets live nadat een mens op Merge heeft gedrukt. Je kunt
> dus niets kapot maken door iets te vragen.

**Wat (nog) niet via een issue kan:** foto's meesturen. Nieuwe foto's
upload je zelf (zie
[Een foto vervangen of toevoegen](#een-foto-vervangen-of-toevoegen)) of
mail je naar Evert; daarna kan Claude ze wel voor je op de juiste plek
in een pagina zetten.

---

## Manier 2: zelf bewerken via GitHub

Wil je liever zelf aan de knoppen zitten, of gaat het om een piepklein
typfoutje? De rest van deze handleiding legt uit hoe je de bestanden
rechtstreeks in je browser bewerkt.

---

## Hoe werkt dit eigenlijk?

Onze website is opgebouwd uit losse tekstbestanden die op GitHub staan.
Elk bestand bevat de inhoud van één pagina (de FAQ-pagina, het lidmaatschap,
een lidverhaal, enzovoorts).

Wanneer jij een bestand wijzigt en op **"Commit changes"** klikt, gebeurt
automatisch:

1. Je wijziging wordt opgeslagen in de geschiedenis
2. GitHub bouwt de hele website opnieuw op
3. Binnen 1 à 2 minuten staat jouw aanpassing live op
   [zcflevo.nl](https://zcflevo.nl)

Je hoeft dus niets te uploaden, niets te bouwen, en niets handmatig te
publiceren.

---

## Tekst aanpassen op een bestaande pagina

### Stap 1: Open de repository

Ga naar
[github.com/EvertDieperink/zcflevo-site](https://github.com/EvertDieperink/zcflevo-site)
en log in. Je ziet een lijst met mappen en bestanden.

### Stap 2: Navigeer naar het juiste bestand

De inhoud van de website staat in de map `content/`:

| Pagina | Bestand |
|---|---|
| Homepage | `content/_index.md` |
| FAQ | `content/faq.md` |
| Leden vertellen | `content/leden-vertellen.md` |
| Contact | `content/contact.md` |
| Hoogvliegers (goed doel) | `content/hoogvliegers.md` |
| Lidmaatschap | `content/de-mogelijkheden/lidmaatschap.md` |
| Kennismakingsstage | `content/de-mogelijkheden/kennismakingsstage.md` |
| Zomercursus | `content/de-mogelijkheden/zomercursus.md` |
| Vliegkampen | `content/de-mogelijkheden/buitenlandkampen.md` |
| Onze Club (overzicht) | `content/onze-club/_index.md` |
| Locatie | `content/onze-club/locatie.md` |
| Vloot | `content/onze-club/vloot.md` |
| Vluchtenoverzichten | `content/onze-club/vluchten.md` |
| Incident melden | `content/onze-club/incident-melden.md` |
| Voor leden | `content/onze-club/voor-leden.md` |

### Stap 3: Klik op het potloodje

Rechtsboven het bestand zie je een rij icoontjes. Klik op het
**potlood-icoon** (Edit this file). De inhoud verschijnt nu in een
tekst-editor.

### Stap 4: Bewerk de tekst

Zoek de plek waar je iets wilt aanpassen en typ je wijziging. Net als bij
een Word-document, alleen in je browser.

### Stap 5: Sla op (commit)

Klik rechtsboven op de groene knop **Commit changes...** Er verschijnt een
venster:

- **Commit message**: korte omschrijving, bijv. *"Typfout in FAQ
  gecorrigeerd"*
- Kies **"Commit directly to the `main` branch"**
- Klik op de groene knop **Commit changes**

### Stap 6: Wacht en controleer

Wacht 1 à 2 minuten en open [zcflevo.nl](https://zcflevo.nl) in een
nieuw tabblad. Druk op **Ctrl+F5** (Windows) of **Cmd+Shift+R** (Mac) om de
nieuwste versie te laden.

---

## Een foto vervangen of toevoegen

Foto's staan op vier plekken:

- `static/images/`: algemene foto's (lidavatars, vloot, logo)
- `assets/images/photo-strip/normal/`: foto's voor de fotostrook op de
  homepage
- `assets/images/photo-strip/wide/`: brede foto's voor de homepage
  (2× breed)
- `assets/images/hero/`: achtergrond-foto's bovenaan de homepage
  (wisselen elke 10 sec)

### Een nieuwe foto uploaden

1. Open de juiste map in GitHub
2. Klik op **Add file → Upload files** (knop rechtsboven)
3. Sleep je foto in het uploadvak (of klik "choose your files")
4. Onderaan: typ een commit message zoals *"Nieuwe foto toegevoegd"*
5. Klik op **Commit changes**

### Een foto vervangen

1. Open de bestaande foto in GitHub (klik erop)
2. Klik op het **prullenbakje** rechtsboven om hem te verwijderen
3. Commit de verwijdering
4. Upload de nieuwe foto met dezelfde naam

> 💡 **Tip:** geef foto's herkenbare namen, bijvoorbeeld `jan-vliegt.jpg`
> in plaats van `IMG_8472.jpg`. De bestandsnaam wordt namelijk als
> alt-tekst gebruikt voor zoekmachines en hulpmiddelen.

---

## Een nieuw lidverhaal toevoegen

Open `content/leden-vertellen.md`. Je ziet een aantal blokken die er zo
uitzien:

```html
<div class="leden-card">
  <div class="leden-card-header">
    <img class="leden-avatar" src="{{< url "/images/jan.jpg" >}}" alt="Jan">
    <div class="leden-name">Jan</div>
  </div>
  <div class="leden-card-body">
    <p>Hier het verhaal van Jan...</p>
  </div>
</div>
```

Kopieer een bestaand blok, plak het op de plek waar je het nieuwe lid wilt
tonen, en pas drie dingen aan:

1. **De foto-naam**: bij `src="..."` zet je je eigen bestandsnaam (eerst
   de foto uploaden in `static/images/`)
2. **De naam**: tussen `<div class="leden-name">...</div>`
3. **Het verhaal**: tussen `<p>...</p>`

---

## Markdown: korte uitleg

De meeste pagina's gebruiken **Markdown**, een eenvoudige manier om tekst
op te maken. Een paar basisregels:

| Wat je wilt | Hoe je het typt |
|---|---|
| **Dikgedrukt** | `**dikgedrukt**` |
| *Cursief* | `*cursief*` |
| Een lijst | begin elke regel met `- ` |
| Een genummerde lijst | begin elke regel met `1. `, `2. `, ... |
| [Een link](https://example.com) | `[link-tekst](https://example.com)` |
| Een kop | `#` (groot), `##` (sub), `###` (sub-sub) |

> 💡 **Tip:** als je twijfelt, klik bovenaan de editor op **Preview**.
> Daar zie je hoe je tekst er straks uit komt te zien, voordat je opslaat.

---

## Shortcodes: stukjes die automatisch worden ingevuld

Soms zie je dingen tussen `{{< ... >}}` haakjes. Dat zijn **shortcodes**:
kleine stukjes die door de website automatisch worden ingevuld. Handig,
omdat je een telefoonnummer of e-mailadres dan maar op één plek hoeft te
onderhouden.

| Shortcode | Wat het doet |
|---|---|
| `{{< email >}}` | Vult het secretaris-mailadres in (klikbaar) |
| `{{< veldtelefoon >}}` | Vult het telefoonnummer voor bij aankomst op het veld in |
| `{{< adres >}}` | Vult het volledige clubadres in op één regel |
| `{{< adres "block" >}}` | Hetzelfde, maar op drie regels onder elkaar |
| `{{< url "/pad/" >}}` | Maakt een interne link die ook werkt op andere domeinen |

> 💡 **Tip:** wil je het secretaris-mailadres wijzigen? Bewerk dan
> `hugo.toml` in de hoofdmap, niet de losse pagina's. Eén wijziging daar
> werkt op de hele site.

---

## Wat je beter NIET kunt aanpassen

Bovenaan elk bestand zie je een blok tussen `---` lijntjes. Dat heet de
**front matter** en bevat technische gegevens zoals de titel van de pagina
en menu-instellingen.

```yaml
---
title: "Lidmaatschap"
description: "Word lid van ZC Flevo en leer zweefvliegen."
menu:
  main:
    parent: "de-mogelijkheden"
    weight: 33
---
```

Je mag de **titel** of de **description** gerust aanpassen, die zijn
gewoon tekst. Maar laat de rest (menu, parent, weight, layout, etc.) liever
staan. Een verkeerde indent of letterfout in dit blok kan de pagina kapot
maken.

> ⚠️ **Let op:** per ongeluk iets stuk gemaakt? Geen paniek. Stuur een
> mailtje naar Evert, hij draait het terug. Zie [Hulp nodig?](#hulp-nodig).

---

## Veelgestelde vragen

### Moet ik elke keer "main" branch kiezen?

Ja. Bij het opslaan kies je altijd **"Commit directly to the `main`
branch"**. Daar staat onze actieve site.

### Kan ik eerst kijken hoe het eruit komt te zien?

Ja, gebruik in de editor de tab **Preview** (naast Edit). Daar zie je de
opmaak. Voor de exacte huisstijl moet je wachten tot de wijziging live
staat (1–2 minuten na opslaan).

### Hoe weet ik wanneer de site is bijgewerkt?

Klik in de repo op het tabblad **Actions**. Je ziet daar een lijst met
bouw-acties. Een groen vinkje betekent: je site is live. Een rood kruisje
betekent: er ging iets mis (in dat geval: mail Evert).

### Ik heb iets per ongeluk verwijderd. Wat nu?

Stop met klikken en stuur een mail. Elke wijziging is teruggedraaibaar
zolang we niets nieuws bovenop committen.

### Mag ik nieuwe pagina's maken?

Liever niet handmatig, want nieuwe pagina's vereisen ook
menu-configuratie. Vraag het via een issue aan @claude (zie
[Manier 1](#manier-1-vraag-het-aan-de-ai)) of mail Evert. Bestaande
pagina's bewerken kan altijd.

---

## Onder de motorkap: hoe werkt het technisch?

Voor wie nieuwsgierig is, een korte uitleg van wat er gebeurt zodra je
op **Commit changes** klikt.

### Hugo: statische site-generator

De website is gebouwd met **[Hugo](https://gohugo.io/)** (versie 0.128.0),
een snelle generator voor statische sites. "Statisch" betekent: er draait
geen database of server-side code, alles wordt vooraf gebouwd tot platte
HTML/CSS/JS. Dat maakt de site snel, goedkoop te hosten en simpel te
onderhouden.

De broncode bestaat uit:

- `content/`: alle pagina-inhoud (Markdown)
- `static/`: afbeeldingen, fonts, CNAME, robots.txt
- `assets/`: afbeeldingen die door Hugo gepipelined worden (resize/optimize)
- `themes/zcflevo/`: ons eigen theme met layouts, CSS, JS en shortcodes
- `hugo.toml`: site-configuratie (titel, e-mail, social links)

### GitHub Actions bouwt automatisch

Bij elke push naar de `main` branch start GitHub Actions de workflow in
[`.github/workflows/hugo.yml`](./.github/workflows/hugo.yml). Die:

1. Haalt Hugo op (versie 0.128.0)
2. Bouwt de site met `hugo --minify --baseURL "https://zcflevo.nl/"`
3. Plaatst het resultaat in de `public/` map

### Deploy naar de `gh-pages` branch

De gegenereerde `public/` map wordt door de workflow gepusht naar een
aparte branch genaamd **`gh-pages`**. Die branch bevat dus geen
broncode, maar uitsluitend het gebouwde resultaat: kant-en-klare HTML
voor de browser. Met `force_orphan: true` schrijft elke deploy de
branch helemaal opnieuw, zodat verwijderde of hernoemde bestanden ook
echt verdwijnen uit de live site.

### GitHub Pages serveert vanaf gh-pages

**GitHub Pages** is geconfigureerd om de `gh-pages` branch te serveren
op het custom domein **zcflevo.nl**. Dat domein wordt gekoppeld via
[`static/CNAME`](./static/CNAME) (Hugo kopieert dit bestand naar de
root van de gh-pages branch). De apex `zcflevo.nl` is canonical;
GitHub stuurt `www.zcflevo.nl` automatisch door.

### Samengevat

```
jouw edit in main  →  GitHub Actions bouwt met Hugo
                   →  resultaat naar de gh-pages branch
                   →  GitHub Pages serveert op zcflevo.nl
```

Het hele proces duurt 1 à 2 minuten. De status van elke build is te
zien in de repo onder het tabblad **Actions**.

### Gemaakt met Claude Code

Deze site, het Hugo-theme, de build-workflow en zelfs deze handleiding
zijn opgezet met behulp van
**[Claude Code](https://www.anthropic.com/claude-code)**: een
AI-coding-agent van Anthropic waarmee je code schrijft (en
sites bouwt) door simpelweg te beschrijven wat je wilt. Veel van het
werk gebeurt in een gesprek: "voeg een pagina toe over X", "vervang
overal Y door Z", "maak het op mobiel beter leesbaar". Dat scheelt
enorm in tijd en helpt om de site fris en consistent te houden.

Diezelfde AI draait ook als **@claude-bot** op deze repository: dat is
de motor achter [Manier 1](#manier-1-vraag-het-aan-de-ai). De
spelregels die de bot volgt staan in [`CLAUDE.md`](./CLAUDE.md), en de
workflow die hem start in
[`.github/workflows/claude.yml`](./.github/workflows/claude.yml).

---

## Hulp nodig?

Loop je vast? Twijfel je? Heb je per ongeluk iets verwijderd?

**Mail Evert Dieperink:
[evert.dieperink@zcflevo.nl](mailto:evert.dieperink@zcflevo.nl)**

Hij kan ook screenshots delen, een korte uitleg via Teams geven, of een
wijziging voor je doen als je liever niet zelf in GitHub graaft.

---

*Een website die door de leden onderhouden wordt, is een levende website.
Hoe meer mensen kleine wijzigingen kunnen doen, hoe actueler en
persoonlijker de site blijft.*
