# CLAUDE.md

Dit bestand geeft Claude (Claude Code, de @claude GitHub-bot en andere AI-sessies)
de spelregels voor deze repository. Volg ze altijd.

## Wat dit is

De publieke website **zcflevo.nl** van Zweefvliegclub Flevo (ZC Flevo, vliegend op
Terlet bij Arnhem). Statische site, gebouwd met **Hugo extended 0.128.0** (vastgezet
in de deploy-workflow). Geen database, geen npm, geen server-side code.

## Taal en stijl

- **Alles in het Nederlands**: content, commit-berichten, antwoorden op issues en PR's.
- **Nooit em-dashes** (gebruik `-`, `·`, `:` of herschrijf de zin).
- Huisstijl: rood `#E21F26`, blauw `#056BB3`. Kleuren staan als CSS-variabelen in
  `themes/zcflevo/static/css/main.css` (`--red`, `--blue`, enz.); hergebruik die.
- Toon: warm, uitnodigend, ledenwervend; je-vorm.

## Architectuur

- `content/`: alle pagina's als Markdown, soms met inline HTML (unsafe rendering
  staat aan). Secties: losse toppagina's, `de-mogelijkheden/` (manieren om mee te
  doen) en `onze-club/` (over de club).
- `themes/zcflevo/`: het enige thema. `layouts/` (templates),
  `static/css/main.css` (het complete ontwerp, ~2000 regels), `static/js/`.
- `static/`: bestanden die letterlijk worden gekopieerd (o.a. `images/` voor
  contentfoto's, `CNAME`, manifests).
- `assets/images/`: afbeeldingen die Hugo verkleint/optimaliseert
  (`hero/` en `photo-strip/` voor de homepage).
- `hugo.toml`: siteconfig. `[params]` bevat de contactgegevens; onderaan staat
  uitleg over het menu.

## Conventies (belangrijk)

- **Menu via front matter**, niet centraal: `menu.main` met `weight` (volgorde),
  `parent` (dropdown), `identifier` (nieuwe dropdown). Zie de uitleg onderaan
  `hugo.toml`.
- **Shortcodes voor herhaalde gegevens**, nooit hardcoden:
  `{{< email >}}`, `{{< veldtelefoon >}}`, `{{< adres >}}` / `{{< adres "block" >}}`
  en `{{< url "/pad/" >}}`. Contactgegevens wijzig je in `hugo.toml`, niet in
  losse pagina's.
- **Interne links en afbeeldingen altijd via `{{< url >}}` of relatieve paden**,
  nooit `https://zcflevo.nl/...` hardcoden (breekt lokaal, baseURL verschilt).
- Nieuwe foto's voor content in `static/images/`.
- Verborgen pagina's (niet in menu of zoekmachines): zet `robots: "noindex, nofollow"`
  en `_build: {list: never, render: always}` in de front matter, zoals
  `content/rondje.md`.
- De FAQ (`content/faq.md`) heeft de vragen dubbel: in de `faqs:` front matter
  (voor structured data) en in de body. Wijzig ze altijd op beide plekken.

## Git en deploy

- Push naar `main` triggert `.github/workflows/hugo.yml`: bouwt de site en
  publiceert automatisch naar de `gh-pages` branch. Na 1 à 2 minuten live op
  zcflevo.nl. **Bewerk `gh-pages` nooit handmatig.**
- **Commit nooit** `public/`, `resources/` of `.vs/`: dat is gebouwde output of
  editor-rommel. Sommige `public/`-bestanden zijn historisch nog getrackt; laat
  wijzigingen daaraan altijd buiten je commits.
- Commit-berichten: kort Nederlands onderwerp dat de wijziging beschrijft.
- Werk als bot altijd via een pull request; push nooit rechtstreeks naar `main`.

## Bijzondere features

- `content/onze-club/vluchten.md` + `static/js/startlijst.js` en `vliegdagen.js`:
  live vluchtdata van de DSA Startplank (Firebase). Voorzichtig mee zijn.
- `content/rondje.md`: verborgen grappagina (langste vlucht van de dag).
- `content/onze-club/jaarkalender.md`: events met `data-van`/`data-tot`; een klein
  inline script dimt voorbije events en labelt "nu bezig" en "eerstvolgende".
- Mapbox-token komt bij de deploy uit een secret; lokaal is de kaart leeg, dat hoort zo.

## Lokaal testen

```
hugo server --bind 0.0.0.0 --port 1313 --baseURL http://localhost:1313/
```

Voor de GitHub-bot is bouwen niet nodig: de deploy-workflow bouwt zelf na een merge.
