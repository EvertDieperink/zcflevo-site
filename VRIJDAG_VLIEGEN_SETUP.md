# Setup instructies: Vrijdag Vliegen formulier

## Stap 1: Formspree Account aanmaken

1. Ga naar https://formspree.io
2. Klik op "Sign Up" 
3. Maak een account aan (je kunt je email gebruiken of inloggen met GitHub)

## Stap 2: Nieuw formulier aanmaken

1. Na inloggen, klik op "New Form" of "+Create"
2. Geef het formulier een naam: "Vrijdag Vliegen - ZC Flevo"
3. Voer het e-mailadres in: `evert.dieperink@zcflevo.nl`
4. Klik "Create Form"

## Stap 3: Form ID kopiëren

1. Na het aanmaken zul je een form ID krijgen (iets als: `mxyqvxpk`)
2. Dit ID staat ook in de url: `https://formspree.io/forms/{ID}/settings`

## Stap 4: Form ID in de website invoeren

1. Open het bestand: `/content/vrijdag-vliegen.md`
2. Zoek naar: `action="https://formspree.io/f/FORMID_PLACEHOLDER"`
3. Vervang `FORMID_PLACEHOLDER` met het ID van stap 3
4. Voorbeeld: `action="https://formspree.io/f/mxyqvxpk"`

## Stap 5: Testen

1. Commit en push de wijzigingen naar GitHub
2. Hugo zal automatisch de site opnieuw builden
3. Ga naar: https://zcflevo.nl/vrijdag-vliegen/
4. Vul het formulier in en test of het werkt
5. Check of een email aankomt op evert.dieperink@zcflevo.nl

## Handige info:

- **URL van de pagina**: https://zcflevo.nl/vrijdag-vliegen/
- **Inschrijf-email**: evert.dieperink@zcflevo.nl
- **Formspree plan**: De gratis tier biedt tot 50 inschrijvingen/maand (meer dan genoeg)

## Optioneel: Formspree instellingen

Als je wilt, kun je in Formspree ook:
- Een bevestiging-email inschakelen naar deelnemers
- Spam-detectie aanpassen
- Redirectpage instellen na inschrijving

## Logo toevoegen

Wanneer je het Ko Piloot logo hebt:
1. Plaats het als `/static/images/ko-piloot-logo.png`
2. Zet dit commentaar uit in `/content/vrijdag-vliegen.md`:
   ```
   ![Ko Piloot - Stichting Hoogvliegers](/images/ko-piloot-logo.png)
   ```

Veel succes! 🚀
