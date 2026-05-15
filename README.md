# Handleiding: website bewerken via GitHub

*Voor clubleden van Zweefvliegclub Flevo*

---

Deze handleiding legt uit hoe je als clublid eenvoudige aanpassingen aan de
website kunt doen: een typfout corrigeren, een foto vervangen, een nieuw
lidverhaal toevoegen. Geen technische voorkennis nodig — als je een e-mail
kunt schrijven, kun je dit ook.

> 💡 **Tip:** Niets is onherstelbaar. Alles wat je doet wordt automatisch
> opgeslagen als "stapje" in de geschiedenis. Iets per ongeluk kapot
> gemaakt? Dat draaien we zo terug. Lees gerust verder en probeer dingen uit.

📄 **Word-versie**: een geprinte/Word-versie van deze handleiding staat als
[`Handleiding-website-bewerken.docx`](./Handleiding-website-bewerken.docx)
in deze repo.

---

## Inhoudsopgave

1. [Wat je nodig hebt](#wat-je-nodig-hebt)
2. [Hoe werkt dit eigenlijk?](#hoe-werkt-dit-eigenlijk)
3. [Tekst aanpassen op een bestaande pagina](#tekst-aanpassen-op-een-bestaande-pagina)
4. [Een foto vervangen of toevoegen](#een-foto-vervangen-of-toevoegen)
5. [Een nieuw lidverhaal toevoegen](#een-nieuw-lidverhaal-toevoegen)
6. [Markdown: korte uitleg](#markdown-korte-uitleg)
7. [Shortcodes: stukjes die automatisch worden ingevuld](#shortcodes-stukjes-die-automatisch-worden-ingevuld)
8. [Wat je beter NIET kunt aanpassen](#wat-je-beter-niet-kunt-aanpassen)
9. [Veelgestelde vragen](#veelgestelde-vragen)
10. [Hulp nodig?](#hulp-nodig)

---

## Wat je nodig hebt

1. Een **GitHub-account** — gratis, registreer eenmalig op
   [github.com/signup](https://github.com/signup)
2. **Toegang tot de ZC Flevo repository** — vraag Evert Dieperink om je
   GitHub-gebruikersnaam toe te voegen als medewerker
   ([evert.dieperink@zcflevo.nl](mailto:evert.dieperink@zcflevo.nl))
3. Een **moderne browser** (Chrome, Edge, Firefox, Safari)

Je hoeft niets te installeren. Geen code, geen terminal, geen Git client.
Alles gebeurt in je browser.

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

- **Commit message** — korte omschrijving, bijv. *"Typfout in FAQ
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

- `static/images/` — algemene foto's (lidavatars, vloot, logo)
- `assets/images/photo-strip/normal/` — foto's voor de fotostrook op de
  homepage
- `assets/images/photo-strip/wide/` — brede foto's voor de homepage
  (2× breed)
- `assets/images/hero/` — achtergrond-foto's bovenaan de homepage
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

1. **De foto-naam** — bij `src="..."` zet je je eigen bestandsnaam (eerst
   de foto uploaden in `static/images/`)
2. **De naam** — tussen `<div class="leden-name">...</div>`
3. **Het verhaal** — tussen `<p>...</p>`

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

Je mag de **titel** of de **description** gerust aanpassen — die zijn
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

Liever niet zelf. Vraag Evert — nieuwe pagina's vereisen ook
menu-configuratie. Bestaande pagina's bewerken kan altijd.

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
