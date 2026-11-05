/* Jaarkalender: items van ZC Flevo zelf (clubactiviteiten, kampen, wedstrijden)
   in je eigen agenda zetten. Per item een keuze uit Google Agenda of een
   .ics-bestand (Apple Agenda, Outlook), plus één knop voor alle data tegelijk.
   Schoolvakanties en feestdagen krijgen bewust geen knop.
   Alles gebeurt in de browser; er is geen server of extern account nodig. */
(function () {
  var kalender = document.querySelector('.kalender');
  if (!kalender) return;

  var CLUB_CATS = ['club', 'kamp', 'wedstrijd'];
  // conceptkalender: data staan nog niet vast; dat moet ook in de agenda te zien zijn
  var concept = kalender.getAttribute('data-concept') === 'ja';
  var CONCEPT_TEKST = 'Let op: conceptdatum, nog niet officieel vastgesteld. Kijk later op de website of deze datum nog klopt.';
  var paginaUrl = location.origin + location.pathname;
  var jaar = (document.title.match(/\d{4}/) || [''])[0];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function datum(iso) { return iso.replace(/-/g, ''); }

  // .ics en Google gebruiken een exclusieve einddatum: de dag na de laatste dag
  function dagNa(iso) {
    var d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  }

  function tekst(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function leesItem(item) {
    var titelEl = item.querySelector('.kalender-titel');
    var titel = '';
    if (titelEl) {
      // alleen de titel zelf, zonder het categorie-label erachter
      titelEl.childNodes.forEach(function (n) { if (n.nodeType === 3) titel += n.textContent; });
    }
    var detail = tekst(item.querySelector('.kalender-detail'));
    return {
      van: item.getAttribute('data-van'),
      tot: item.getAttribute('data-tot'),
      titel: 'ZC Flevo: ' + titel.replace(/\s+/g, ' ').trim() + (concept ? ' (concept)' : ''),
      detail: detail,
      locatie: item.getAttribute('data-locatie') || '',
      uid: 'zcflevo-' + item.getAttribute('data-van') + '-' + titel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '@zcflevo.nl'
    };
  }

  function omschrijving(ev) {
    return (concept ? CONCEPT_TEKST + '\n\n' : '') + (ev.detail ? ev.detail + '\n\n' : '') + 'Actuele data en details: ' + paginaUrl;
  }

  // RFC 5545: tekst escapen en lange regels vouwen
  function esc(s) { return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function vouw(regel) {
    var uit = [];
    while (regel.length > 74) { uit.push(regel.slice(0, 74)); regel = ' ' + regel.slice(74); }
    uit.push(regel);
    return uit.join('\r\n');
  }

  function vevent(ev) {
    var nu = new Date();
    var stamp = nu.getUTCFullYear() + pad(nu.getUTCMonth() + 1) + pad(nu.getUTCDate()) + 'T' +
      pad(nu.getUTCHours()) + pad(nu.getUTCMinutes()) + pad(nu.getUTCSeconds()) + 'Z';
    var r = [
      'BEGIN:VEVENT',
      'UID:' + ev.uid,
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + datum(ev.van),
      'DTEND;VALUE=DATE:' + dagNa(ev.tot),
      'SUMMARY:' + esc(ev.titel),
      'DESCRIPTION:' + esc(omschrijving(ev)),
      'URL:' + paginaUrl,
      'TRANSP:TRANSPARENT',
      'STATUS:' + (concept ? 'TENTATIVE' : 'CONFIRMED')
    ];
    if (ev.locatie) r.push('LOCATION:' + esc(ev.locatie));
    r.push('END:VEVENT');
    return r.map(vouw).join('\r\n');
  }

  function ics(events) {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Zweefvliegclub Flevo//Jaarkalender//NL',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      vouw('X-WR-CALNAME:' + esc('ZC Flevo jaarkalender ' + jaar)),
      events.map(vevent).join('\r\n'),
      'END:VCALENDAR'
    ].join('\r\n') + '\r\n';
  }

  function download(naam, inhoud) {
    var blob = new Blob([inhoud], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = naam;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function googleUrl(ev) {
    var p = new URLSearchParams({
      action: 'TEMPLATE',
      text: ev.titel,
      dates: datum(ev.van) + '/' + dagNa(ev.tot),
      details: omschrijving(ev)
    });
    if (ev.locatie) p.set('location', ev.locatie);
    return 'https://calendar.google.com/calendar/render?' + p.toString();
  }

  function bestandsnaam(ev) {
    return 'zcflevo-' + ev.van + '-' + ev.titel.replace(/^ZC Flevo: /, '').replace(/ \(concept\)$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '') + '.ics';
  }

  var icoon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v4M10 15h4"/></svg>';

  var items = [].slice.call(kalender.querySelectorAll('.kalender-item[data-cat]')).filter(function (el) {
    return CLUB_CATS.indexOf(el.getAttribute('data-cat')) !== -1;
  });

  var vandaag = new Date();
  vandaag.setHours(0, 0, 0, 0);
  var komend = [];

  items.forEach(function (item) {
    var ev = leesItem(item);
    if (new Date(ev.tot + 'T23:59:59') < vandaag) return; // voorbij: geen knop
    komend.push(ev);

    var keuze = document.createElement('details');
    keuze.className = 'kalender-agenda';
    keuze.innerHTML =
      '<summary>' + icoon + '<span>In mijn agenda</span></summary>' +
      '<div class="kalender-agenda-menu">' +
        '<a class="ka-google" target="_blank" rel="noopener">Google Agenda</a>' +
        '<button type="button" class="ka-ics">Apple Agenda of Outlook (.ics)</button>' +
        (concept ? '<p class="ka-concept">Conceptdatum: kan nog wijzigen.</p>' : '') +
      '</div>';
    keuze.querySelector('.ka-google').href = googleUrl(ev);
    keuze.querySelector('.ka-ics').addEventListener('click', function () {
      download(bestandsnaam(ev), ics([ev]));
      keuze.open = false;
    });
    item.appendChild(keuze);
  });

  // menu sluiten bij klikken ernaast of Escape
  document.addEventListener('click', function (e) {
    kalender.querySelectorAll('.kalender-agenda[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.open = false;
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    kalender.querySelectorAll('.kalender-agenda[open]').forEach(function (d) {
      d.open = false;
      d.querySelector('summary').focus();
    });
  });

  // één knop voor alle komende ZC Flevo-data
  if (komend.length > 1) {
    var blok = document.createElement('div');
    blok.className = 'kalender-alles';
    blok.innerHTML =
      '<button type="button" class="btn btn-blue">' + icoon + '<span>Alle ZC Flevo-data in mijn agenda</span></button>' +
      '<p>Eén bestand met ' + komend.length + ' clubactiviteiten en kampen voor Apple Agenda, Outlook en Google Agenda. Schoolvakanties en feestdagen staan er niet in.' +
      (concept ? ' <strong>Het zijn conceptdata</strong>: in je agenda staan ze als "(concept)".' : '') + '</p>';
    blok.querySelector('button').addEventListener('click', function () {
      download('zcflevo-jaarkalender-' + jaar + '.ics', ics(komend));
    });
    var legenda = kalender.querySelector('.kalender-legenda');
    kalender.insertBefore(blok, legenda);
  }
})();
