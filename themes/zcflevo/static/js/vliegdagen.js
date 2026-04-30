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

const CLUB_AIRCRAFT = [
  'PH-1433', 'PH-974', 'PH-1382', 'PH-1006',
  'PH-1273', 'PH-1210', 'PH-1571'
];
const ICAO = 'EHTL';

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
  return CLUB_AIRCRAFT.some(r => normaliseReg(r) === n);
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

function renderTotals(flights) {
  // Group by registration
  const map = {};
  for (const f of flights) {
    const key = f.registration;
    if (!map[key]) map[key] = { registration: f.registration, type: f.type, cn: f.cn, starts: 0, totalSec: 0 };
    map[key].starts++;
    map[key].totalSec += f.duration || 0;
  }

  const rows = Object.values(map)
    .sort((a, b) => a.registration.localeCompare(b.registration))
    .map(r => `<tr>
      <td><strong>${r.registration}</strong></td>
      <td>${r.type || '—'}</td>
      <td>${r.cn || '—'}</td>
      <td>${r.starts}</td>
      <td>${fmtDuration(r.totalSec)}</td>
    </tr>`).join('');

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

function renderTable(flights, dateStr) {
  const rows = flights.map(f => {
    const inAir = f.start && !f.stop;
    const landingCell = inAir
      ? '<span class="flight-badge flight-badge--air">In de lucht</span>'
      : fmtTime(f.stop);

    const height = f.max_height ? `${f.max_height} m` : '—';

    return `<tr>
      <td><strong>${f.registration}</strong></td>
      <td>${f.type || '—'}</td>
      <td>${f.cn || '—'}</td>
      <td>${fmtTime(f.start)}</td>
      <td>${landingCell}</td>
      <td>${fmtDuration(f.duration)}</td>
      <td>${height}</td>
    </tr>`;
  }).join('');

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
    ${renderTotals(flights)}`;
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
