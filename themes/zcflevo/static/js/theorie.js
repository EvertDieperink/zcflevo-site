/* Theorie-oefenquiz (verborgen sectie /theorie/).
   Volledig client-side: vragenbanken zijn statische JSON-bestanden
   (/theorie/<vak>.json). Elk vak heeft een eigen pagina
   (/theorie/<vak>/, herkenbaar aan data-vak op de app-container);
   /theorie/ zelf is de vakkenkiezer. Resultaten worden per gebruiker
   bewaard in localStorage en zijn te downloaden als logbestand. Een
   lopende quiz staat in sessionStorage en overleeft zo een herlaadactie. */
(function () {
  'use strict';

  var VAKKEN = [
    { slug: 'luchtvaartwetgeving',    naam: 'Luchtvaartwetgeving' },
    { slug: 'menselijke-prestaties',  naam: 'Menselijke prestaties en beperkingen' },
    { slug: 'meteorologie',           naam: 'Meteorologie' },
    { slug: 'communicatie',           naam: 'Communicatie' },
    { slug: 'beginselen',             naam: 'Beginselen van het zweefvliegen' },
    { slug: 'operationele-procedures',naam: 'Operationele procedures' },
    { slug: 'vliegprestaties',        naam: 'Vliegprestaties en vluchtplanning' },
    { slug: 'algemene-kennis',        naam: 'Algemene kennis van het zweefvliegtuig' },
    { slug: 'navigatie',              naam: 'Navigatie' }
  ];
  var VRAGEN_PER_RONDE = 20;
  var SLAGINGSGRENS = 0.75; // EASA SFCL.135: 75% per vak
  var LOG_KEY = 'zc-theorie-log';
  var SESSIE_KEY = 'zc-theorie-sessie';

  var app = document.getElementById('theorie-app');
  if (!app) { return; }
  var basis = app.getAttribute('data-basis') || './';
  var huidigVak = null;
  (function () {
    var slug = app.getAttribute('data-vak');
    for (var i = 0; i < VAKKEN.length; i++) {
      if (VAKKEN[i].slug === slug) { huidigVak = VAKKEN[i]; }
    }
  })();

  var banken = {}; // slug -> geladen vragenbank

  /* ---------- opslag ---------- */

  function leesLog() {
    try {
      var log = JSON.parse(localStorage.getItem(LOG_KEY) || '{"pogingen":[]}');
      if (!log.pogingen) { log.pogingen = []; }
      return log;
    } catch (e) { return { pogingen: [] }; }
  }
  function bewaarPoging(poging) {
    var log = leesLog();
    log.pogingen.push(poging);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) { /* opslag vol of geblokkeerd */ }
  }
  function leesSessie() {
    try { return JSON.parse(sessionStorage.getItem(SESSIE_KEY) || 'null'); } catch (e) { return null; }
  }
  function wisSessie() { try { sessionStorage.removeItem(SESSIE_KEY); } catch (e) {} }

  function vakStats(slug) {
    var p = leesLog().pogingen.filter(function (x) { return x.vak === slug; });
    if (!p.length) { return null; }
    var beste = Math.max.apply(null, p.map(function (x) { return x.score; }));
    return { pogingen: p.length, beste: beste, laatste: p[p.length - 1].score, totaal: p[0].totaal };
  }

  /* ---------- dom-helpers (textContent, dus veilig) ---------- */

  function el(tag, cls, tekst) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (tekst !== undefined) { e.textContent = tekst; }
    return e;
  }
  function knop(tekst, cls, onclick) {
    var b = el('button', 'theorie-knop' + (cls ? ' ' + cls : ''), tekst);
    b.type = 'button';
    b.addEventListener('click', onclick);
    return b;
  }
  function leeg() { app.textContent = ''; }
  function naarVakkenkiezer() { window.location.href = basis; }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- vakkenkiezer (/theorie/) ---------- */

  function toonStart() {
    wisSessie(); // terug bij de kiezer = bewust gestopt met de lopende ronde
    leeg();
    app.appendChild(el('h2', 'theorie-kop', 'Kies een vak'));
    var grid = el('div', 'theorie-vakgrid');
    VAKKEN.forEach(function (vak, vi) {
      var kaart = el('a', 'theorie-vakkaart');
      kaart.href = basis + vak.slug + '/';
      kaart.appendChild(el('span', 'theorie-vaknr', String(vi + 1)));
      kaart.appendChild(el('span', 'theorie-vaknaam', vak.naam));
      var stats = vakStats(vak.slug);
      kaart.appendChild(el('span', 'theorie-vakstats',
        stats ? 'Beste: ' + stats.beste + '/' + stats.totaal + ' · ' + stats.pogingen + 'x geoefend'
              : 'Nog niet geoefend'));
      grid.appendChild(kaart);
    });
    app.appendChild(grid);

    var voet = el('div', 'theorie-voet');
    voet.appendChild(knop('Mijn resultaten', 'theorie-knop-secundair', toonLog));
    app.appendChild(voet);
  }

  /* ---------- quiz ---------- */

  function startQuiz(vak) {
    leeg();
    app.appendChild(el('p', 'theorie-laden', 'Vragen laden voor ' + vak.naam + '…'));

    var klaar = function (bank) {
      var vragen = shuffle(bank.vragen).slice(0, VRAGEN_PER_RONDE).map(function (vr) {
        // husselen van de antwoordopties, met behoud van het juiste antwoord
        var volgorde = shuffle([0, 1, 2, 3]);
        return {
          v: vr.v,
          a: volgorde.map(function (i) { return vr.a[i]; }),
          juist: volgorde.indexOf(vr.juist),
          uitleg: vr.uitleg || ''
        };
      });
      draaiQuiz(vak, { slug: vak.slug, vragen: vragen, index: 0, goed: 0, fouten: [], weetniet: [] });
    };

    if (banken[vak.slug]) { klaar(banken[vak.slug]); return; }
    fetch(basis + vak.slug + '.json')
      .then(function (r) { if (!r.ok) { throw new Error('HTTP ' + r.status); } return r.json(); })
      .then(function (bank) { banken[vak.slug] = bank; klaar(bank); })
      .catch(function () {
        leeg();
        app.appendChild(el('p', 'theorie-fout', 'De vragenbank voor "' + vak.naam + '" kon niet geladen worden. Probeer het later opnieuw.'));
        app.appendChild(knop('Terug naar de vakken', 'theorie-knop-secundair', naarVakkenkiezer));
      });
  }

  function draaiQuiz(vak, sessie) {
    if (!sessie.weetniet) { sessie.weetniet = []; } // oudere sessies hervatten
    function bewaarSessie() {
      try { sessionStorage.setItem(SESSIE_KEY, JSON.stringify(sessie)); } catch (e) {}
    }
    bewaarSessie();
    // Niet scrollen bij het laden van de pagina; alleen bij het doorklikken
    // tussen vragen (dan staat de gebruiker onderaan bij de Volgende-knop).
    var stilleWeergave = true;

    function toonVraag() {
      leeg();
      var vr = sessie.vragen[sessie.index];

      var kop = el('div', 'theorie-quizkop');
      kop.appendChild(el('span', 'theorie-quizvak', vak.naam));
      kop.appendChild(el('span', 'theorie-quizteller', 'Vraag ' + (sessie.index + 1) + ' van ' + sessie.vragen.length));
      app.appendChild(kop);

      var balk = el('div', 'theorie-balk');
      var vulling = el('div', 'theorie-balkvulling');
      vulling.style.width = Math.round((sessie.index / sessie.vragen.length) * 100) + '%';
      balk.appendChild(vulling);
      app.appendChild(balk);

      app.appendChild(el('p', 'theorie-vraag', vr.v));

      var lijst = el('div', 'theorie-antwoorden');
      var beantwoord = false;
      var weetKnop;

      function sluitVraagAf(feedback) {
        lijst.querySelectorAll('.theorie-antwoord').forEach(function (kn, ki) {
          kn.disabled = true;
          if (ki === vr.juist) { kn.classList.add('is-juist'); }
        });
        weetKnop.disabled = true;
        app.appendChild(feedback);
        var laatste = (sessie.index + 1 >= sessie.vragen.length);
        app.appendChild(knop(laatste ? 'Naar de uitslag' : 'Volgende vraag', 'theorie-knop-primair', function () {
          sessie.index++;
          bewaarSessie();
          if (sessie.index >= sessie.vragen.length) { toonUitslag(); } else { toonVraag(); }
        }));
      }

      vr.a.forEach(function (optie, i) {
        var b = el('button', 'theorie-antwoord');
        b.type = 'button';
        b.appendChild(el('span', 'theorie-letter', String.fromCharCode(65 + i)));
        b.appendChild(el('span', 'theorie-optietekst', optie));
        b.addEventListener('click', function () {
          if (beantwoord) { return; }
          beantwoord = true;
          var isGoed = (i === vr.juist);
          if (isGoed) { sessie.goed++; }
          else {
            sessie.fouten.push({ v: vr.v, gekozen: optie, juist: vr.a[vr.juist] });
            b.classList.add('is-fout');
          }
          var feedback = el('div', 'theorie-feedback ' + (isGoed ? 'is-goed' : 'is-mis'));
          feedback.appendChild(el('strong', null, isGoed ? 'Goed! ' : 'Helaas. '));
          if (vr.uitleg) { feedback.appendChild(document.createTextNode(vr.uitleg)); }
          sluitVraagAf(feedback);
        });
        lijst.appendChild(b);
      });
      app.appendChild(lijst);

      // Losse "weet ik niet"-optie: geen punt, geen fout, maar apart geteld.
      weetKnop = el('button', 'theorie-weetniet', 'Ik weet het niet');
      weetKnop.type = 'button';
      weetKnop.addEventListener('click', function () {
        if (beantwoord) { return; }
        beantwoord = true;
        sessie.weetniet.push({ v: vr.v, juist: vr.a[vr.juist] });
        var feedback = el('div', 'theorie-feedback is-neutraal');
        feedback.appendChild(el('strong', null, 'Geen punt, wel een leermoment. '));
        if (vr.uitleg) { feedback.appendChild(document.createTextNode(vr.uitleg)); }
        sluitVraagAf(feedback);
      });
      app.appendChild(weetKnop);
      if (!stilleWeergave) { window.scrollTo({ top: app.offsetTop - 90, behavior: 'smooth' }); }
      stilleWeergave = false;
    }

    function toonUitslag() {
      wisSessie();
      bewaarPoging({
        t: new Date().toISOString(),
        vak: vak.slug,
        vaknaam: vak.naam,
        score: sessie.goed,
        totaal: sessie.vragen.length,
        fouten: sessie.fouten,
        weetniet: sessie.weetniet
      });

      leeg();
      var geslaagd = (sessie.goed / sessie.vragen.length) >= SLAGINGSGRENS;
      var kaart = el('div', 'theorie-uitslag ' + (geslaagd ? 'is-geslaagd' : 'is-gezakt'));
      kaart.appendChild(el('div', 'theorie-uitslagscore', sessie.goed + ' / ' + sessie.vragen.length));
      kaart.appendChild(el('div', 'theorie-uitslagdetail',
        'Goed: ' + sessie.goed + ' · Fout: ' + sessie.fouten.length + ' · Weet niet: ' + sessie.weetniet.length));
      kaart.appendChild(el('div', 'theorie-uitslagtekst', geslaagd
        ? 'Geslaagd! Boven de examengrens van 75%.'
        : 'Nog even oefenen: het examen vraagt 75% (' + Math.ceil(sessie.vragen.length * SLAGINGSGRENS) + ' goed).'));
      app.appendChild(kaart);

      if (sessie.fouten.length) {
        app.appendChild(el('h3', 'theorie-kop', 'Je fouten op een rij'));
        sessie.fouten.forEach(function (f) {
          var blok = el('div', 'theorie-foutblok');
          blok.appendChild(el('p', 'theorie-foutvraag', f.v));
          blok.appendChild(el('p', 'theorie-foutdetail', 'Jouw antwoord: ' + f.gekozen));
          blok.appendChild(el('p', 'theorie-foutdetail is-juisttekst', 'Juiste antwoord: ' + f.juist));
          app.appendChild(blok);
        });
      }

      if (sessie.weetniet.length) {
        app.appendChild(el('h3', 'theorie-kop', 'Wist je nog niet'));
        sessie.weetniet.forEach(function (f) {
          var blok = el('div', 'theorie-foutblok theorie-foutblok--weetniet');
          blok.appendChild(el('p', 'theorie-foutvraag', f.v));
          blok.appendChild(el('p', 'theorie-foutdetail is-juisttekst', 'Juiste antwoord: ' + f.juist));
          app.appendChild(blok);
        });
      }

      var voet = el('div', 'theorie-voet');
      voet.appendChild(knop('Nog een ronde', 'theorie-knop-primair', function () { startQuiz(vak); }));
      voet.appendChild(knop('Ander vak', 'theorie-knop-secundair', naarVakkenkiezer));
      voet.appendChild(knop('Mijn resultaten', 'theorie-knop-secundair', toonLog));
      app.appendChild(voet);
      window.scrollTo({ top: app.offsetTop - 90, behavior: 'smooth' });
    }

    toonVraag();
  }

  /* ---------- resultatenlog ---------- */

  function toonLog() {
    leeg();
    var log = leesLog();
    app.appendChild(el('h2', 'theorie-kop', 'Mijn resultaten'));

    if (!log.pogingen.length) {
      app.appendChild(el('p', 'theorie-laden', 'Nog geen pogingen gedaan. Kies een vak om te beginnen!'));
    } else {
      var tabel = el('table', 'theorie-tabel');
      var kopRij = el('tr');
      ['Vak', 'Pogingen', 'Beste', 'Laatste'].forEach(function (h) { kopRij.appendChild(el('th', null, h)); });
      tabel.appendChild(kopRij);
      VAKKEN.forEach(function (vak) {
        var s = vakStats(vak.slug);
        if (!s) { return; }
        var rij = el('tr');
        rij.appendChild(el('td', null, vak.naam));
        rij.appendChild(el('td', null, String(s.pogingen)));
        rij.appendChild(el('td', null, s.beste + '/' + s.totaal));
        rij.appendChild(el('td', null, s.laatste + '/' + s.totaal));
        tabel.appendChild(rij);
      });
      app.appendChild(tabel);

      app.appendChild(el('h3', 'theorie-kop', 'Alle pogingen'));
      var lijst = el('table', 'theorie-tabel');
      var kop2 = el('tr');
      ['Datum', 'Vak', 'Score', 'Weet niet'].forEach(function (h) { kop2.appendChild(el('th', null, h)); });
      lijst.appendChild(kop2);
      log.pogingen.slice().reverse().forEach(function (p) {
        var rij = el('tr');
        var d = new Date(p.t);
        rij.appendChild(el('td', null, d.toLocaleDateString('nl-NL') + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })));
        rij.appendChild(el('td', null, p.vaknaam || p.vak));
        rij.appendChild(el('td', null, p.score + '/' + p.totaal));
        rij.appendChild(el('td', null, p.weetniet ? String(p.weetniet.length) : '0'));
        lijst.appendChild(rij);
      });
      app.appendChild(lijst);
    }

    var voet = el('div', 'theorie-voet');
    voet.appendChild(knop('Terug naar de vakken', 'theorie-knop-primair', function () {
      if (huidigVak) { naarVakkenkiezer(); } else { toonStart(); }
    }));
    if (log.pogingen.length) {
      voet.appendChild(knop('Download mijn log', 'theorie-knop-secundair', function () {
        var blob = new Blob([JSON.stringify(leesLog(), null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'theorie-log.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }));
      voet.appendChild(knop('Log wissen', 'theorie-knop-gevaar', function () {
        if (window.confirm('Weet je zeker dat je al je resultaten wilt wissen?')) {
          localStorage.removeItem(LOG_KEY);
          toonLog();
        }
      }));
    }
    app.appendChild(voet);
  }

  /* ---------- start ---------- */

  if (huidigVak) {
    var sessie = leesSessie();
    if (sessie && sessie.slug === huidigVak.slug && sessie.vragen && sessie.index < sessie.vragen.length) {
      draaiQuiz(huidigVak, sessie); // lopende ronde hervatten na een herlaadactie
    } else {
      wisSessie();
      startQuiz(huidigVak);
    }
  } else {
    toonStart();
  }
})();
