/**
 * ZC Flevo — Vliegdagen
 * Haalt vluchtdata op via Open Glider Network (flightbook.glidernet.org)
 * en filtert op de clubvliegtuigen van ZC Flevo.
 *
 * API structuur:
 *   response.devices[n].registration  → bijv. "PH-1433"
 *   response.flights[i].device        → index n in devices[]
 *   response.flights[i].start         → "10h24"
 *   response.flights[i].stop          → "11h02" (null als nog in de lucht)
 *   response.flights[i].duration      → seconden
 *
 * Wrapped in IIFE om naam-conflicten met startlijst.js te voorkomen
 * (beide scripts hebben helpers als renderTable, fmtTime, etc.).
 */

(function () {
'use strict';

const CLUB_AIRCRAFT_ZC = [
  'PH-1433', 'PH-974', 'PH-1382', 'PH-1006',
  'PH-1273', 'PH-1210', 'PH-1571'
];
const CLUB_AIRCRAFT_DSA = [
  'PH-1357', 'PH-1364', 'PH-1268', 'PH-777', 'PH-785'
];
const ICAO = 'EHTL';

function activeAircraftList() {
  const list = CLUB_AIRCRAFT_ZC.slice();
  if (window.ZCFlevo && window.ZCFlevo.showDSA) list.push(...CLUB_AIRCRAFT_DSA);
  return list;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

/** "10h24" → "10:24" */
function fmtTime(t) {
  if (!t) return '—';
  return String(t).replace('h', ':');
}

function fmtDuration(seconds) {
  if (seconds == null || seconds === 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}u ${String(m).padStart(2, '0')}m`;
  return `${m} min`;
}

function normaliseReg(reg) {
  return (reg || '').replace(/[\s\-]/g, '').toUpperCase();
}

function isClubAircraft(reg) {
  const n = normaliseReg(reg);
  return activeAircraftList().some(r => normaliseReg(r) === n);
}

function isDsaAircraft(reg) {
  const n = normaliseReg(reg);
  return CLUB_AIRCRAFT_DSA.some(r => normaliseReg(r) === n);
}

// ── Fetch ──────────────────────────────────────────────────────────────────────

async function fetchLogbook(dateStr) {
  const url = `https://flightbook.glidernet.org/api/logbook/${ICAO}/${dateStr}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Process ───────────────────────────────────────────────────────────────────

function processLogbook(data) {
  const devices = data.devices || [];
  const flights = data.flights || [];

  return flights
    .map(f => {
      const dev = devices[f.device] || {};
      return {
        registration : dev.registration || '',
        type         : dev.aircraft     || '',
        cn           : dev.competition  || '',
        start        : f.start          || null,
        stop         : f.stop           || null,
        duration     : f.duration       || null,
        max_height   : f.max_height     || null,
        start_delta  : f.start_delta    || 0,
        warn         : f.warn           || false,
      };
    })
    .filter(f => isClubAircraft(f.registration))
    .sort((a, b) => (a.start || '').localeCompare(b.start || ''));
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderLoading() {
  return `<div class="flights-loading">
    <div class="spinner"></div>
    <span>Vluchten ophalen&hellip;</span>
  </div>`;
}

function renderEmpty(dateStr) {
  return `<div class="flights-empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
    <p>Geen clubvluchten gevonden op <strong>${dateStr}</strong>.</p>
    <p class="flights-empty-sub">Mogelijk geen vliegdag, of FLARM-ontvangst ontbrak.</p>
  </div>`;
}

function renderError(dateStr) {
  const fallback = `https://flightbook.glidernet.org/logbook/${ICAO}/${dateStr}`;
  return `<div class="flights-error">
    <p>⚠️ Vluchtdata kon niet worden geladen.</p>
    <a href="${fallback}" target="_blank" rel="noopener" class="btn btn-blue">
      Bekijk op flightbook.glidernet.org &rarr;
    </a>
  </div>`;
}

function renderTotals(flights, isToday) {
  // Group by registration
  const map = {};
  for (const f of flights) {
    const key = f.registration;
    if (!map[key]) map[key] = {
      registration: f.registration, type: f.type, cn: f.cn,
      starts: 0, totalSec: 0,
      hasUncertain: false,
      missingDuration: 0,
    };
    map[key].starts++;
    map[key].totalSec += f.duration || 0;

    // Een vlucht is "onzeker" als:
    // - de start sterk geschat is (start_delta > drempel)
    // - er geen exacte start gedetecteerd is
    // - de duur onbekend is (en niet omdat de vlucht nu in de lucht is)
    // - er geen landing gedetecteerd is op een historische dag
    const isInAirNow = f.start && !f.stop && isToday;
    const noStop     = f.start && !f.stop && !isToday;
    const approxStart = f.start_delta && f.start_delta > APPROX_THRESHOLD_SEC;
    const noDuration  = (f.duration == null || f.duration === 0) && !isInAirNow;

    if (approxStart || noStop || noDuration || !f.start) {
      map[key].hasUncertain = true;
    }
    if (noDuration) map[key].missingDuration++;
  }

  const rows = Object.values(map)
    .sort((a, b) => a.registration.localeCompare(b.registration))
    .map(r => {
      let totalCell;
      if (!r.totalSec) {
        totalCell = '<span class="time-unknown" title="Geen meetbare duur beschikbaar">— onbekend</span>';
      } else if (r.hasUncertain) {
        const detail = r.missingDuration > 0
          ? `Niet betrouwbaar: ${r.missingDuration} van ${r.starts} vlucht${r.starts !== 1 ? 'en' : ''} mist een exacte tijd`
          : 'Niet betrouwbaar: bevat vluchten met onzekere tijden';
        totalCell = `<span class="time-approx" title="${detail}">~ ${fmtDuration(r.totalSec)}</span>`;
      } else {
        totalCell = fmtDuration(r.totalSec);
      }

      const dsaBadge = isDsaAircraft(r.registration)
        ? ' <span class="club-badge club-badge--dsa" title="DSA zusterclub">DSA</span>'
        : '';
      const regCell = r.hasUncertain
        ? `<strong>${r.registration}</strong>${dsaBadge} <span class="time-approx" title="Onzekere of ontbrekende tijden in deze totalen" aria-label="onzeker">*</span>`
        : `<strong>${r.registration}</strong>${dsaBadge}`;

      return `<tr>
        <td>${regCell}</td>
        <td>${r.type || '—'}</td>
        <td>${r.cn || '—'}</td>
        <td>${r.starts}</td>
        <td>${totalCell}</td>
      </tr>`;
    }).join('');

  return `
    <h3 class="flights-totals-title">Totalen per vliegtuig</h3>
    <div class="flights-table-wrap">
      <table class="flights-table">
        <thead>
          <tr>
            <th>Registratie</th>
            <th>Type</th>
            <th>CN</th>
            <th>Starts</th>
            <th>Totale duur</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/** Drempel in seconden waarboven we een tijd als "geschat" markeren. */
const APPROX_THRESHOLD_SEC = 60;

/** Render starttijd; als sterk geschat: prefix "~" en title-tooltip. */
function fmtStart(f) {
  if (!f.start) return '<span class="time-unknown" title="Geen exacte start-detectie">— niet gedetecteerd</span>';
  const time = fmtTime(f.start);
  if (f.start_delta && f.start_delta > APPROX_THRESHOLD_SEC) {
    const min = Math.round(f.start_delta / 60);
    return `<span class="time-approx" title="Tijd geschat (onzekerheid ± ${min} min)">~ ${time}</span>`;
  }
  return time;
}

function fmtStop(f, isToday) {
  if (f.start && !f.stop) {
    if (isToday) {
      return '<span class="flight-badge flight-badge--air">In de lucht</span>';
    }
    return '<span class="time-unknown" title="Geen landings-detectie door OGN (FLARM-ontvangst mogelijk verloren)">— niet gedetecteerd</span>';
  }
  if (!f.stop) {
    return '<span class="time-unknown" title="Geen exacte landings-detectie">— niet gedetecteerd</span>';
  }
  return fmtTime(f.stop);
}

function fmtDurationCell(f, isToday) {
  if (f.duration == null || f.duration === 0) {
    if (f.start && !f.stop && isToday) {
      return '<span class="text-muted">—</span>';
    }
    return '<span class="time-unknown" title="Duur kon niet exact bepaald worden">— onbekend</span>';
  }
  return fmtDuration(f.duration);
}

function renderTable(flights, dateStr) {
  const isToday = dateStr === toDateStr(new Date());

  // Heeft minstens 1 vlucht een onzekere tijd? Dan tonen we een legenda.
  const hasApprox = flights.some(f =>
    (f.start_delta && f.start_delta > APPROX_THRESHOLD_SEC) ||
    (f.start && !f.stop && !isToday) ||
    (!f.start) ||
    (f.duration == null && !(f.start && !f.stop && isToday))
  );

  const rows = flights.map(f => {
    const height = f.max_height ? `${f.max_height} m` : '—';
    const dsaBadge = isDsaAircraft(f.registration)
      ? ' <span class="club-badge club-badge--dsa" title="DSA zusterclub">DSA</span>'
      : '';
    return `<tr>
      <td><strong>${f.registration}</strong>${dsaBadge}</td>
      <td>${f.type || '—'}</td>
      <td>${f.cn || '—'}</td>
      <td>${fmtStart(f)}</td>
      <td>${fmtStop(f, isToday)}</td>
      <td>${fmtDurationCell(f, isToday)}</td>
      <td>${height}</td>
    </tr>`;
  }).join('');

  const legend = hasApprox ? `
    <p class="flights-legend">
      <span class="time-approx">~ tijd</span> = geschatte tijd (FLARM-detectie onnauwkeurig).
      <span class="time-unknown">— niet gedetecteerd</span> = OGN heeft geen exact start- of landingsmoment kunnen vaststellen.
      In de totalen-tabel hieronder markeert <span class="time-approx">*</span> vliegtuigen waarvan de totale duur niet betrouwbaar is doordat sommige vluchten onzekere of ontbrekende tijden hebben.
    </p>` : '';

  return `
    <div class="flights-summary">
      <strong>${flights.length}</strong> vlucht${flights.length !== 1 ? 'en' : ''} van clubvliegtuigen op <strong>${dateStr}</strong>
    </div>
    <div class="flights-table-wrap">
      <table class="flights-table">
        <thead>
          <tr>
            <th>Registratie</th>
            <th>Type</th>
            <th>CN</th>
            <th>Start</th>
            <th>Landing</th>
            <th>Duur</th>
            <th>Max hoogte</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${legend}
    ${renderTotals(flights, isToday)}`;
}

// ── Init ──────────────────────────────────────────────────────────────────────

/**
 * Initialiseer de FLARM-vluchtenviewer op een specifieke set DOM-elementen.
 * @param {object} ids
 * @param {string} ids.appId   ID van het container-element waar vluchten in komen
 * @param {string} ids.dateId  ID van de date input
 * @param {string} ids.prevId  ID van de "vorige dag" knop
 * @param {string} ids.nextId  ID van de "volgende dag" knop
 */
function initFlarmViewer(ids = {}) {
  const appId  = ids.appId  || 'flights-app';
  const dateId = ids.dateId || 'flight-date';
  const prevId = ids.prevId || 'prev-day';
  const nextId = ids.nextId || 'next-day';

  const app     = document.getElementById(appId);
  const input   = document.getElementById(dateId);
  const btnPrev = document.getElementById(prevId);
  const btnNext = document.getElementById(nextId);

  if (!app || !input || !btnPrev || !btnNext) return;

  async function load(dateStr) {
    app.innerHTML = renderLoading();
    try {
      const data    = await fetchLogbook(dateStr);
      const flights = processLogbook(data);
      app.innerHTML = flights.length ? renderTable(flights, dateStr) : renderEmpty(dateStr);
    } catch (err) {
      console.warn('Vluchtdata fout:', err);
      app.innerHTML = renderError(dateStr);
    }
  }

  function shiftDay(delta) {
    const d = new Date(input.value + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    const newDate = toDateStr(d);
    if (newDate <= toDateStr(new Date())) {
      input.value = newDate;
      load(newDate);
    }
  }

  const today = toDateStr(new Date());
  input.value = today;
  input.max   = today;

  input.addEventListener('change', () => load(input.value));
  btnPrev.addEventListener('click', () => shiftDay(-1));
  btnNext.addEventListener('click', () => shiftDay(1));

  // Reload als de DSA-toggle wisselt (event vanuit vluchten.html)
  document.addEventListener('zcflevo:dsa-toggle', () => load(input.value));

  load(today);
}

// Expose voor expliciete init op nieuwe gecombineerde pagina
window.ZCFlevo = window.ZCFlevo || {};
window.ZCFlevo.initFlarmViewer = initFlarmViewer;

// Auto-init op pagina's met de standaard IDs (oude vliegdagen-pagina).
// Op de gecombineerde vluchten-pagina bestaan deze IDs niet, dus geen botsing.
if (document.getElementById('flights-app') && document.getElementById('flight-date')) {
  initFlarmViewer();
}

})();
