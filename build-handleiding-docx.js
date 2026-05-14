// Build the ZC Flevo handleiding as a Word document with custom styling.
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, ExternalHyperlink, PageNumber, Header, Footer,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ZC Flevo design tokens
const BLUE       = '056BB3';
const BLUE_DARK  = '235696';
const TEXT       = '222222';
const TEXT_MUTED = '57585E';
const BORDER     = 'E0E0E0';
const CODE_BG    = 'F4F4F5';
const TIP_BG     = 'EAF3FB';
const WARN_BG    = 'FEF3C7';
const WARN_BORD  = 'F9C74F';
const HEADER_BG  = '235696';

const FONT = 'Calibri';
const noBorders = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

// --- Helpers ----------------------------------------------------------------
const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  ...opts,
  children: [
    new TextRun({ text, font: FONT, size: 22, color: TEXT, ...(opts.runProps || {}) }),
  ],
});

// Paragraph with mixed runs (e.g. some bold, some not)
const mixed = (runs, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  ...opts,
  children: runs.map(r => {
    if (r.kind === 'link') {
      return new ExternalHyperlink({
        link: r.href,
        children: [new TextRun({ text: r.text, font: FONT, size: 22, color: BLUE, underline: {} })],
      });
    }
    if (r.kind === 'code') {
      return new TextRun({ text: r.text, font: 'Consolas', size: 20, color: TEXT, shading: { type: ShadingType.CLEAR, fill: CODE_BG } });
    }
    return new TextRun({
      text: r.text, font: FONT, size: 22, color: r.color || TEXT,
      bold: r.bold || false, italics: r.italic || false,
    });
  }),
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 240, after: 240 },
  children: [new TextRun({ text, font: FONT, size: 44, bold: true, color: BLUE_DARK })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 360, after: 160 },
  children: [new TextRun({ text, font: FONT, size: 32, bold: true, color: BLUE })],
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: BLUE })],
});

const subtitle = (text) => new Paragraph({
  spacing: { after: 360 },
  alignment: AlignmentType.LEFT,
  children: [new TextRun({ text, font: FONT, size: 22, italics: true, color: TEXT_MUTED })],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, font: FONT, size: 22, color: TEXT })],
});
const numItem = (text, ref = 'numbers') => new Paragraph({
  numbering: { reference: ref, level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, font: FONT, size: 22, color: TEXT })],
});

// Tip-box: one-cell table with light-blue fill and blue left border
const tipBox = (textRuns) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' },
    left:   { style: BorderStyle.SINGLE, size: 24, color: BLUE },
    right:  { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: TIP_BG },
          margins: { top: 200, bottom: 200, left: 280, right: 240 },
          children: [
            new Paragraph({
              spacing: { after: 0 },
              children: textRuns,
            }),
          ],
        }),
      ],
    }),
  ],
});

const warnBox = (textRuns) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' },
    left:   { style: BorderStyle.SINGLE, size: 24, color: WARN_BORD },
    right:  { style: BorderStyle.NONE,   size: 0, color: 'FFFFFF' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: WARN_BG },
          margins: { top: 200, bottom: 200, left: 280, right: 240 },
          children: [new Paragraph({ spacing: { after: 0 }, children: textRuns })],
        }),
      ],
    }),
  ],
});

const tipText = (parts) => {
  // parts: array of {text, bold?, italic?}
  return parts.map(part => new TextRun({
    text: part.text, font: FONT, size: 22, color: TEXT,
    bold: part.bold || false, italics: part.italic || false,
  }));
};

// Code block table (1 cell, monospace, grey background)
const codeBlock = (lines) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 4, color: BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
    left:   { style: BorderStyle.SINGLE, size: 4, color: BORDER },
    right:  { style: BorderStyle.SINGLE, size: 4, color: BORDER },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: CODE_BG },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          children: lines.map(line => new Paragraph({
            spacing: { after: 0 },
            children: [new TextRun({ text: line, font: 'Consolas', size: 20, color: TEXT })],
          })),
        }),
      ],
    }),
  ],
});

// Two-column reference table with blue header
const refTable = (header, rows, cols = [3600, 5760]) => {
  const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
  const cellBorders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({
        tableHeader: true,
        children: header.map((h, i) => new TableCell({
          borders: cellBorders,
          width: { size: cols[i], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: HEADER_BG },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [new Paragraph({
            spacing: { after: 0 },
            children: [new TextRun({ text: h, font: FONT, size: 22, bold: true, color: 'FFFFFF' })],
          })],
        })),
      }),
      ...rows.map(row => new TableRow({
        children: row.map((cell, i) => new TableCell({
          borders: cellBorders,
          width: { size: cols[i], type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({
            spacing: { after: 0 },
            children: cell.code
              ? [new TextRun({ text: cell.text, font: 'Consolas', size: 20, color: TEXT })]
              : [new TextRun({ text: cell.text || cell, font: FONT, size: 22, color: TEXT })],
          })],
        })),
      })),
    ],
  });
};

// --- Document content ------------------------------------------------------
const docChildren = [
  // Title block
  h1('Handleiding: website bewerken via GitHub'),
  subtitle('Voor clubleden van Zweefvliegclub Flevo'),

  // Intro
  h2('Inleiding'),
  p('Deze handleiding legt uit hoe je als clublid eenvoudige aanpassingen aan de website kunt doen: een typfout corrigeren, een foto vervangen, een nieuw lidverhaal toevoegen. Geen technische voorkennis nodig, als je een e-mail kunt schrijven, kun je dit ook.'),
  tipBox(tipText([
    { text: 'Tip: ', bold: true },
    { text: 'Niets is onherstelbaar. Alles wat je doet wordt automatisch opgeslagen als "stapje" in de geschiedenis. Iets per ongeluk kapot gemaakt? Dat draaien we zo terug. Lees gerust verder en probeer dingen uit.' },
  ])),

  // Wat je nodig hebt
  h2('Wat je nodig hebt'),
  mixed([
    { text: '1. Een ' },
    { text: 'GitHub-account', bold: true },
    { text: ', gratis, registreer eenmalig op ' },
    { kind: 'link', text: 'github.com/signup', href: 'https://github.com/signup' },
  ]),
  mixed([
    { text: '2. ' },
    { text: 'Toegang tot de ZC Flevo repository', bold: true },
    { text: ', vraag Evert Dieperink om je GitHub-gebruikersnaam toe te voegen als medewerker (' },
    { kind: 'link', text: 'evert.dieperink@zcflevo.nl', href: 'mailto:evert.dieperink@zcflevo.nl' },
    { text: ')' },
  ]),
  mixed([
    { text: '3. Een ' },
    { text: 'moderne browser', bold: true },
    { text: ' (Chrome, Edge, Firefox, Safari)' },
  ]),
  p('Je hoeft niets te installeren. Geen code, geen terminal, geen Git client. Alles gebeurt in je browser.'),

  // Hoe werkt dit
  h2('Hoe werkt dit eigenlijk?'),
  p('Onze website is opgebouwd uit losse tekstbestanden die op GitHub staan. Elk bestand bevat de inhoud van één pagina (de FAQ-pagina, het lidmaatschap, een lidverhaal, enzovoorts).'),
  mixed([
    { text: 'Wanneer jij een bestand wijzigt en op ' },
    { text: 'Commit changes', bold: true },
    { text: ' klikt, gebeurt automatisch:' },
  ]),
  numItem('Je wijziging wordt opgeslagen in de geschiedenis'),
  numItem('GitHub bouwt de hele website opnieuw op'),
  numItem('Binnen 1 à 2 minuten staat jouw aanpassing live op zcflevo.nl'),
  p('Je hoeft dus niets te uploaden, niets te bouwen, en niets handmatig te publiceren.'),

  // Tekst aanpassen
  h2('Tekst aanpassen op een bestaande pagina'),
  h3('Stap 1: Open de repository'),
  mixed([
    { text: 'Ga naar ' },
    { kind: 'link', text: 'github.com/EvertDieperink/zcflevo-site', href: 'https://github.com/EvertDieperink/zcflevo-site' },
    { text: ' en log in. Je ziet een lijst met mappen en bestanden.' },
  ]),

  h3('Stap 2: Navigeer naar het juiste bestand'),
  mixed([
    { text: 'Klik door tot je het bestand vindt dat je wilt aanpassen. De inhoud van de website staat in de map ' },
    { kind: 'code', text: 'content/' },
    { text: ':' },
  ]),
  refTable(
    ['Pagina', 'Bestand'],
    [
      ['Homepage',                  { text: 'content/_index.md', code: true }],
      ['FAQ',                       { text: 'content/faq.md', code: true }],
      ['Leden vertellen',           { text: 'content/leden-vertellen.md', code: true }],
      ['Contact',                   { text: 'content/contact.md', code: true }],
      ['Vrijdag Vliegen',           { text: 'content/vrijdag-vliegen.md', code: true }],
      ['Lidmaatschap',              { text: 'content/de-mogelijkheden/lidmaatschap.md', code: true }],
      ['Kennismakingsstage',        { text: 'content/de-mogelijkheden/kennismakingsstage.md', code: true }],
      ['Zomercursus',               { text: 'content/de-mogelijkheden/zomercursus.md', code: true }],
      ['Vliegkampen',               { text: 'content/de-mogelijkheden/buitenlandkampen.md', code: true }],
      ['Onze Club (overzicht)',     { text: 'content/onze-club/_index.md', code: true }],
      ['Locatie',                   { text: 'content/onze-club/locatie.md', code: true }],
      ['Vloot',                     { text: 'content/onze-club/vloot.md', code: true }],
      ['Vluchtenoverzichten',       { text: 'content/onze-club/vluchten.md', code: true }],
      ['Incident melden',           { text: 'content/onze-club/incident-melden.md', code: true }],
    ],
    [3600, 5760],
  ),

  h3('Stap 3: Klik op het potloodje'),
  p('Wanneer je het bestand hebt geopend, zie je rechtsboven een rij icoontjes. Klik op het potlood-icoon (Edit this file). De inhoud verschijnt in een tekst-editor.'),

  h3('Stap 4: Bewerk de tekst'),
  p('Zoek de plek waar je iets wilt aanpassen en typ je wijziging. Net als bij een Word-document, alleen in je browser.'),

  h3('Stap 5: Sla op (commit)'),
  mixed([
    { text: 'Klik rechtsboven op de groene knop ' },
    { text: 'Commit changes...', bold: true },
    { text: ' Er verschijnt een venster:' },
  ]),
  bullet('Commit message: korte omschrijving, bijvoorbeeld "Typfout in FAQ gecorrigeerd"'),
  bullet('Kies "Commit directly to the main branch"'),
  mixed([
    { text: 'Klik op de groene knop ' },
    { text: 'Commit changes', bold: true },
  ]),

  h3('Stap 6: Wacht en controleer'),
  mixed([
    { text: 'Wacht 1 à 2 minuten en open zcflevo.nl in een nieuw tabblad. Druk op ' },
    { text: 'Ctrl+F5', bold: true },
    { text: ' (Windows) of ' },
    { text: 'Cmd+Shift+R', bold: true },
    { text: ' (Mac) om de nieuwste versie te laden.' },
  ]),

  // Foto's
  h2("Een foto vervangen of toevoegen"),
  p("Foto's staan op vier plekken:"),
  mixed([
    { kind: 'code', text: 'static/images/' },
    { text: ', algemene foto\'s (lidavatars, vloot, logo)' },
  ]),
  mixed([
    { kind: 'code', text: 'assets/images/photo-strip/normal/' },
    { text: ', foto\'s voor de fotostrook op de homepage' },
  ]),
  mixed([
    { kind: 'code', text: 'assets/images/photo-strip/wide/' },
    { text: ', brede foto\'s voor de homepage (2x breed)' },
  ]),
  mixed([
    { kind: 'code', text: 'assets/images/hero/' },
    { text: ', achtergrond-foto\'s bovenaan de homepage' },
  ]),

  h3('Een nieuwe foto uploaden'),
  numItem('Open de juiste map in GitHub'),
  mixed([
    { text: 'Klik op ' },
    { text: 'Add file → Upload files', bold: true },
    { text: ' rechtsboven' },
  ], { numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 } }),
  numItem('Sleep je foto in het uploadvak'),
  numItem('Onderaan: typ een commit message zoals "Nieuwe foto toegevoegd"'),
  mixed([
    { text: 'Klik op ' },
    { text: 'Commit changes', bold: true },
  ], { numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 } }),

  h3('Een foto vervangen'),
  numItem('Open de bestaande foto in GitHub'),
  numItem('Klik op het prullenbakje rechtsboven om hem te verwijderen'),
  numItem('Commit de verwijdering'),
  numItem('Upload de nieuwe foto met dezelfde naam'),

  tipBox(tipText([
    { text: 'Tip: ', bold: true },
    { text: 'Geef foto\'s herkenbare namen, bijvoorbeeld ' },
    { text: 'jan-vliegt.jpg', italic: true },
    { text: ' in plaats van ' },
    { text: 'IMG_8472.jpg', italic: true },
    { text: '. De bestandsnaam wordt als alt-tekst gebruikt voor zoekmachines.' },
  ])),

  // Lidverhaal
  h2('Een nieuw lidverhaal toevoegen'),
  mixed([
    { text: 'Open ' },
    { kind: 'code', text: 'content/leden-vertellen.md' },
    { text: '. Je ziet een aantal blokken die er zo uit zien:' },
  ]),
  codeBlock([
    '<div class="leden-card">',
    '  <div class="leden-card-header">',
    '    <img class="leden-avatar" src="{{< url "/images/jan.jpg" >}}" alt="Jan">',
    '    <div class="leden-name">Jan</div>',
    '  </div>',
    '  <div class="leden-card-body">',
    '    <p>Hier het verhaal van Jan...</p>',
    '  </div>',
    '</div>',
  ]),
  p('Kopieer een bestaand blok, plak het op de plek waar je het nieuwe lid wilt tonen, en pas drie dingen aan:'),
  mixed([
    { text: 'De foto-naam', bold: true },
    { text: ', bij ' },
    { kind: 'code', text: 'src="..."' },
    { text: ' zet je je eigen bestandsnaam (eerst de foto uploaden in ' },
    { kind: 'code', text: 'static/images/' },
    { text: ')' },
  ], { numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 } }),
  mixed([
    { text: 'De naam', bold: true },
    { text: ', tussen ' },
    { kind: 'code', text: '<div class="leden-name">...</div>' },
  ], { numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 } }),
  mixed([
    { text: 'Het verhaal', bold: true },
    { text: ', tussen ' },
    { kind: 'code', text: '<p>...</p>' },
  ], { numbering: { reference: 'numbers', level: 0 }, spacing: { after: 80 } }),

  // Markdown
  h2('Markdown: korte uitleg'),
  mixed([
    { text: 'De meeste pagina\'s gebruiken ' },
    { text: 'Markdown', bold: true },
    { text: ', een eenvoudige manier om tekst op te maken.' },
  ]),
  refTable(
    ['Wat je wilt', 'Hoe je het typt'],
    [
      ['Dikgedrukt',             { text: '**dikgedrukt**',                    code: true }],
      ['Cursief',                { text: '*cursief*',                         code: true }],
      ['Een lijst',              { text: 'begin elke regel met "- "',        code: true }],
      ['Een genummerde lijst',   { text: 'begin elke regel met "1. ", "2. "', code: true }],
      ['Een link',               { text: '[link-tekst](https://example.com)', code: true }],
      ['Een kop',                { text: '# kop  ## sub  ### sub-sub',         code: true }],
    ],
    [3600, 5760],
  ),
  tipBox(tipText([
    { text: 'Tip: ', bold: true },
    { text: 'Als je twijfelt, klik bovenaan de editor op ' },
    { text: 'Preview', bold: true },
    { text: '. Daar zie je hoe je tekst er uit komt te zien, voordat je opslaat.' },
  ])),

  // Shortcodes
  h2('Shortcodes: stukjes die automatisch worden ingevuld'),
  mixed([
    { text: 'Soms zie je dingen tussen ' },
    { kind: 'code', text: '{{< ... >}}' },
    { text: ' haakjes. Dat zijn ' },
    { text: 'shortcodes', bold: true },
    { text: ': kleine stukjes die door de website automatisch worden ingevuld. Handig, omdat je een telefoonnummer of e-mailadres dan maar op één plek hoeft te onderhouden.' },
  ]),
  refTable(
    ['Shortcode', 'Wat het doet'],
    [
      [{ text: '{{< email >}}',           code: true }, 'Vult het secretaris-mailadres in (klikbaar)'],
      [{ text: '{{< veldtelefoon >}}',    code: true }, 'Vult het telefoonnummer voor bij aankomst op het veld in'],
      [{ text: '{{< adres >}}',           code: true }, 'Vult het volledige clubadres in op één regel'],
      [{ text: '{{< adres "block" >}}',   code: true }, 'Hetzelfde, maar op drie regels onder elkaar'],
      [{ text: '{{< url "/pad/" >}}',     code: true }, 'Maakt een interne link die ook werkt op andere domeinen'],
    ],
    [3500, 5860],
  ),
  tipBox(tipText([
    { text: 'Tip: ', bold: true },
    { text: 'Wil je het secretaris-mailadres wijzigen? Bewerk dan ' },
    { text: 'hugo.toml', italic: true },
    { text: ' in de hoofdmap, niet de losse pagina\'s. Eén wijziging daar werkt op de hele site.' },
  ])),

  // Wat NIET
  h2('Wat je beter NIET kunt aanpassen'),
  mixed([
    { text: 'Bovenaan elk bestand zie je een blok tussen ' },
    { kind: 'code', text: '---' },
    { text: ' lijntjes. Dat heet de ' },
    { text: 'front matter', bold: true },
    { text: ' en bevat technische gegevens.' },
  ]),
  codeBlock([
    '---',
    'title: "Lidmaatschap"',
    'description: "Word lid van ZC Flevo en leer zweefvliegen."',
    'menu:',
    '  main:',
    '    parent: "de-mogelijkheden"',
    '    weight: 33',
    '---',
  ]),
  mixed([
    { text: 'Je mag de ' },
    { text: 'titel', bold: true },
    { text: ' of ' },
    { text: 'description', bold: true },
    { text: ' gerust aanpassen. Maar laat de rest (menu, parent, weight, layout) liever staan. Een verkeerde indent of letterfout hier kan de pagina kapot maken.' },
  ]),
  warnBox(tipText([
    { text: 'Let op: ', bold: true },
    { text: 'Per ongeluk iets stuk gemaakt? Geen paniek. Stuur een mailtje naar Evert, hij draait het terug.' },
  ])),

  // FAQ
  h2('Veelgestelde vragen'),
  mixed([{ text: 'Moet ik elke keer "main" branch kiezen?', bold: true }]),
  p('Ja. Bij het opslaan kies je altijd "Commit directly to the main branch".'),
  mixed([{ text: 'Kan ik eerst kijken hoe het eruit komt te zien?', bold: true }]),
  mixed([
    { text: 'Ja, gebruik in de editor de tab ' },
    { text: 'Preview', bold: true },
    { text: ' (naast Edit). Voor de exacte huisstijl moet je wachten tot de wijziging live staat (1 tot 2 minuten na opslaan).' },
  ]),
  mixed([{ text: 'Hoe weet ik wanneer de site is bijgewerkt?', bold: true }]),
  mixed([
    { text: 'Klik in de repo op het tabblad ' },
    { text: 'Actions', bold: true },
    { text: '. Een groen vinkje = je site is live. Een rood kruisje = er ging iets mis (mail Evert).' },
  ]),
  mixed([{ text: 'Ik heb iets per ongeluk verwijderd. Wat nu?', bold: true }]),
  p('Stop met klikken en stuur een mail. Elke wijziging is teruggedraaibaar.'),
  mixed([{ text: "Mag ik nieuwe pagina's maken?", bold: true }]),
  p("Liever niet zelf. Vraag Evert, nieuwe pagina's vereisen ook menu-configuratie."),

  // Hulp
  h2('Hulp nodig?'),
  p('Loop je vast? Twijfel je? Of wil je gewoon even sparren voordat je iets opslaat?'),
  mixed([
    { text: 'Mail Evert Dieperink: ', bold: true },
    { kind: 'link', text: 'evert.dieperink@zcflevo.nl', href: 'mailto:evert.dieperink@zcflevo.nl' },
  ]),
  p('Hij kan ook screenshots delen, een korte uitleg via Teams geven, of een wijziging voor je doen.'),

  // Closing quote
  new Paragraph({
    spacing: { before: 480, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: 'Een website die door de leden onderhouden wordt, is een levende website. Hoe meer mensen kleine wijzigingen kunnen doen, hoe actueler en persoonlijker de site blijft.',
      font: FONT, size: 22, italics: true, color: TEXT_MUTED,
    })],
  }),
];

const doc = new Document({
  creator: 'Zweefvliegclub Flevo',
  title: 'Handleiding website bewerken via GitHub',
  description: 'Voor clubleden van Zweefvliegclub Flevo',
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: TEXT } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 44, bold: true, font: FONT, color: BLUE_DARK },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: BLUE },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: FONT, color: BLUE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Zweefvliegclub Flevo — Handleiding website bewerken — pagina ', font: FONT, size: 18, color: TEXT_MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: TEXT_MUTED }),
          ],
        })],
      }),
    },
    children: docChildren,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, 'Handleiding-website-bewerken.docx');
  fs.writeFileSync(out, buf);
  console.log('Written:', out, '(' + buf.length + ' bytes)');
});
