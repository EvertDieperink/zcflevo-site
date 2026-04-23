---
title: "Vrijdag Vliegen – Steun Stichting Hoogvliegers"
description: "Kom vliegen op een vrijdag bij ZC Flevo en steun Stichting Hoogvliegers. €40 per vlucht gaat rechtstreeks naar deze mooie stichting."
---

<p class="vrijdag-slogan">Vlieg mee voor een glimlach ✈️</p>

Zweefvliegen is een ervaring die je niet snel vergeet. Bij **Zweefvliegclub Flevo** organiseren we **Vrijdag Vliegen**: een actie waarbij jij een introductievlucht maakt én meteen een goed doel steunt. Voor **€40** vlieg je mee in onze tweezitter. Het volledige bedrag gaat rechtstreeks naar **Stichting Hoogvliegers**.

## Over Stichting Hoogvliegers

![Ko Piloot - Stichting Hoogvliegers](/images/ko-piloot-logo.png)

**Stichting Hoogvliegers** geeft gehandicapte en zieke jongeren de kans om te vliegen én voor één dag zelf piloot te zijn. Zij maken dromen waar en zorgen voor onvergetelijke ervaringen in de lucht – volledig gratis voor deze kinderen.

Meer informatie vind je op [www.stichtinghoogvliegers.nl](https://www.stichtinghoogvliegers.nl).

## Hoe werkt het?

Je schrijft je in via onderstaand formulier. Wij nemen contact met je op om een geschikte vrijdag te plannen. Op de afgesproken dag kom je naar onze club, vlieg je mee in de tweezitter, en betaal je €40 ter plekke rechtstreeks aan Stichting Hoogvliegers.

### De details

| | |
|---|---|
| ⏱️ **Vluchtduur** | 5 tot 30 minuten (afhankelijk van de thermiek) |
| 💰 **Kosten** | €40, rechtstreeks aan Stichting Hoogvliegers |
| 📅 **Wanneer** | Op afspraak, op een vrijdag |
| 👥 **Voor wie** | Iedereen is welkom – geen ervaring nodig |
| 📋 **Inclusief** | Instructie, verzekering en een onvergetelijke ervaring |

### Goed om te weten

Om mee te mogen vliegen moet je in goede gezondheid zijn. Twijfel je of vliegen iets voor jou is? Neem gerust contact met ons op.

## Inschrijven

Vul onderstaand formulier in en klik op "Schrijf mij in". Je eigen e-mailprogramma opent met de inschrijving al ingevuld – klik op verzenden en wij nemen zo snel mogelijk contact met je op.

<form id="vrijdag-form" class="vrijdag-form" onsubmit="return verzendInschrijving(event)">
  <div class="form-group">
    <label for="naam">Volledige naam *</label>
    <input type="text" id="naam" name="naam" required>
  </div>

  <div class="form-group">
    <label for="email">E-mailadres *</label>
    <input type="email" id="email" name="email" required>
  </div>

  <div class="form-group">
    <label for="telefoon">Telefoonnummer</label>
    <input type="tel" id="telefoon" name="telefoon">
  </div>

  <div class="form-group">
    <label for="aantal">Aantal deelnemers *</label>
    <input type="number" id="aantal" name="aantal" min="1" value="1" required>
  </div>

  <div class="form-group">
    <label for="opmerkingen">Opmerkingen of vragen</label>
    <textarea id="opmerkingen" name="opmerkingen" rows="4" placeholder="Bijvoorbeeld: voorkeur voor een bepaalde datum of bijzonderheden"></textarea>
  </div>

  <button type="submit" class="btn-primary">Schrijf mij in</button>
</form>

<script>
function verzendInschrijving(event) {
  event.preventDefault();

  var naam = document.getElementById('naam').value;
  var email = document.getElementById('email').value;
  var telefoon = document.getElementById('telefoon').value;
  var aantal = document.getElementById('aantal').value;
  var opmerkingen = document.getElementById('opmerkingen').value;

  var onderwerp = 'Inschrijving Vrijdag Vliegen - ' + naam;

  var body = 'Hallo,\n\n';
  body += 'Ik wil me graag inschrijven voor Vrijdag Vliegen.\n\n';
  body += '--- Mijn gegevens ---\n';
  body += 'Naam: ' + naam + '\n';
  body += 'E-mail: ' + email + '\n';
  body += 'Telefoon: ' + (telefoon || '-') + '\n';
  body += 'Aantal deelnemers: ' + aantal + '\n';

  if (opmerkingen) {
    body += '\n--- Opmerkingen ---\n' + opmerkingen + '\n';
  }

  body += '\nMet vriendelijke groet,\n' + naam;

  var mailto = 'mailto:evert.dieperink@zcflevo.nl'
    + '?subject=' + encodeURIComponent(onderwerp)
    + '&body=' + encodeURIComponent(body);

  window.location.href = mailto;
  return false;
}
</script>

## Vragen?

Heb je nog vragen over Vrijdag Vliegen? Neem gerust contact op:

- **E-mail**: [evert.dieperink@zcflevo.nl](mailto:evert.dieperink@zcflevo.nl)
- **Telefoon**: 06-17722964

We horen graag van je!
