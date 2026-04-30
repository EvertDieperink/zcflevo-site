/**
 * ZC Flevo — Startlijst Terlet
 * Haalt vluchtdata op via DSA Startplank (Firebase Realtime Database)
 *
 * Endpoint: https://dsa-startplank.firebaseio.com/flydays/{YYYY-MM-DD}/flights.json
 *
 * Per vlucht:
 *   startTime / endTime  — Unix ms timestamp
 *   commander            — { name, status }
 *   passenger            — { name, status } of null
 *   plane                — { callsign, name, registration, seats }
 *   type                 — vluchttype (bijv. "Trainingsvlucht SFCL160.a.1.ii")
 *   winch                — { name }
 *
 * Wrapped in IIFE om naam-conflicten met vliegdagen.js te voorkomen
 * (beide scripts hebben helpers als renderTable, fmtTime, etc.).
 */

(function () {
'use strict';

const DB_URL       = 'https://dsa-startplank.firebaseio.com';
const CLUB_REG     = ['PH-1433', 'PH-974', 'PH-1382', 'PH-1006', 'PH-1273', 'PH-1210', 'PH-1571'];
const POLL_MS      = 30_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateStr(d) { return d.toISOString().slice(0, 10); }

function fmtTime(ms) {
  if (!ms) return '\u2014';
  return new Date(ms).toLocaleTimeString('nl-NL', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam'
  });
}

function fmtDuration(startMs, endMs) {
  if (!startMs || !endMs) return '\u2014';
  const sec = Math.round((endMs - startMs) / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}u\u00a0${String(m).padStart(2, '0')}m`;
  return `${m}\u00a0min`;
}

function isClub(reg) {
  const n = (reg || '').replace(/[\s-]/g, '').toUpperCase();
  return CLUB_REG.some(r => r.replace(/[\s-]/g, '') === n);
}

function statusBadge(status) {
  if (!status) return '';
  const cls = {
    'Instructeur':          'status-instructeur',
    'Leerling Instructeur': 'status-linstructeur',
    'Solo':                 'status-solo',
    'ZVB':                  'status-zvb',
    'Leerling':             'status-leerling',
    'DBO':                  'status-dbo',
  }[status] || 'status-other';
  return `<span class="pilot-badge ${cls}">${status}</span>`;
}

/** Verwijder SFCL-regelcode achter vluchttype voor kortere weergave. */
function shortType(type) {
  if (!type) return '\u2014';
  const short = type.replace(/\s+SFCL[\w.]+$/i, '').trim();
  // Keep full text as tooltip
  return `<span title="${type}">${short || type}</span>`;
}

// ── Fetch ──────────────────────────────────────────────────────────────────────

async function fetchFlights(dateStr) {
  const res = await fetch(`${DB_URL}/flydays/${dateStr}/flights.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderLoading() {
  return `<div class="flights-loading">
    <div class="spinner"></div>
    <span>Startlijst ophalen&hellip;</span>
  </div>`;
}

function renderEmpty(dateStr) {
  return `<div class="flights-empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
    <p>Geen vluchten gevonden op <strong>${dateStr}</strong>.</p>
    <p class="flights-empty-sub">Mogelijk geen vliegdag, of nog geen data beschikbaar in DSA Startplank.</p>
  </div>`;
}

function renderError() {
  return `<div class="flights-error">
    <p>&#x26A0;&#xFE0F; Startlijst kon niet worden geladen.</p>
    <a href="https://dsa-startplank.firebaseapp.com/actief" target="_blank" rel="noopener" class="btn btn-blue">
      Bekijk op DSA Startplank &rarr;
    </a>
  </div>`;
}

function renderTotals(flights) {
  const map = {};
  for (const f of flights) {
    const key = f.plane?.callsign || f.plane?.registration || '?';
    if (!map[key]) map[key] = {
      key,
      reg:    f.plane?.registration || '',
      type:   f.plane?.name || '',
      starts: 0,
      totalMs: 0,
    };
    map[key].starts++;
    if (f.startTime && f.endTime) map[key].totalMs += f.endTime - f.startTime;
  }

  const rows = Object.values(map)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(r => `<tr>
      <td><strong>${r.key}</strong></td>
      <td>${r.reg || '\u2014'}</td>
      <td>${r.type || '\u2014'}</td>
      <td>${r.starts}</td>
      <td>${r.totalMs ? fmtDuration(0, r.totalMs) : '\u2014'}</td>
    </tr>`).join('');

  return `
    <h3 class="flights-totals-title">Totalen per vliegtuig</h3>
    <div class="flights-table-wrap">
      <table class="flights-table">
        <thead><tr>
          <th>Roepnaam</th>
          <th>Registratie</th>
          <th>Type</th>
          <th>Starts</th>
          <th>Totale duur</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderTable(flights, dateStr) {
  const rows = flights.map(f => {
    const inAir      = f.startTime && !f.endTime;
    const callsign   = f.plane?.callsign || f.plane?.registration || '?';
    const planeName  = f.plane?.name || '';

    const commanderCell = f.commander?.name
      ? `${f.commander.name} ${statusBadge(f.commander.status)}`
      : '\u2014';

    const passengerCell = f.passenger?.name
      ? `${f.passenger.name} ${statusBadge(f.passenger.status)}`
      : '<span class="text-muted">enkel</span>';

    const landingCell = inAir
      ? '<span class="flight-badge flight-badge--air">In de lucht</span>'
      : fmtTime(f.endTime);

    return `<tr>
      <td><strong>${callsign}</strong><br><small class="text-muted">${planeName}</small></td>
      <td>${commanderCell}</td>
      <td>${passengerCell}</td>
      <td>${shortType(f.type)}</td>
      <td>${fmtTime(f.startTime)}</td>
      <td>${landingCell}</td>
      <td>${fmtDuration(f.startTime, f.endTime)}</td>
      <td><small>${f.winch?.name || '\u2014'}</small></td>
    </tr>`;
  }).join('');

  return `
    <div class="flights-summary">
      <strong>${flights.length}</strong> start${flights.length !== 1 ? 'en' : ''} van ZC Flevo toestellen op <strong>${dateStr}</strong>
    </div>
    <div class="flights-table-wrap">
      <table class="flights-table">
        <thead><tr>
          <th>Vliegtuig</th>
          <th>Gezagvoerder</th>
          <th>Mede-inzittende</th>
          <th>Type vlucht</th>
          <th>Start</th>
          <th>Landing</th>
          <th>Duur</th>
          <th>Lier</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${renderTotals(flights)}`;
}

// ── Init ──────────────────────────────────────────────────────────────────────

/**
 * Initialiseer de Startplank-viewer op een specifieke set DOM-elementen.
 * @param {object} ids
 * @param {string} ids.appId   ID van het container-element waar vluchten in komen
 * @param {string} ids.dateId  ID van de date input
 * @param {string} ids.prevId  ID van de "vorige dag" knop
 * @param {string} ids.nextId  ID van de "volgende dag" knop
 */
function initStartplankViewer(ids = {}) {
  const appId  = ids.appId  || 'flights-app';
  const dateId = ids.dateId || 'flight-date';
  const prevId = ids.prevId || 'prev-day';
  const nextId = ids.nextId || 'next-day';

  const app     = document.getElementById(appId);
  const input   = document.getElementById(dateId);
  const btnPrev = document.getElementById(prevId);
  const btnNext = document.getElementById(nextId);

  if (!app || !input || !btnPrev || !btnNext) return;

  let localPollTimer = null;

  async function load(dateStr, silent = false) {
    if (!silent) app.innerHTML = renderLoading();
    try {
      const data = await fetchFlights(dateStr);
      const flights = data
        ? Object.values(data)
            .filter(f => isClub(f.plane?.registration))
            .sort((a, b) => (a.startTime || 0) - (b.startTime || 0))
        : [];
      app.innerHTML = flights.length ? renderTable(flights, dateStr) : renderEmpty(dateStr);
    } catch (err) {
      console.warn('Startlijst fout:', err);
      if (!silent) app.innerHTML = renderError();
    }
  }

  function startPolling(dateStr) {
    stopPolling();
    localPollTimer = setInterval(() => load(dateStr, true), POLL_MS);
  }

  function stopPolling() {
    if (localPollTimer) { clearInterval(localPollTimer); localPollTimer = null; }
  }

  function setDate(dateStr) {
    input.value = dateStr;
    load(dateStr);
    if (dateStr === toDateStr(new Date())) startPolling(dateStr);
    else stopPolling();
  }

  function shiftDay(delta) {
    const d = new Date(input.value + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    const next = toDateStr(d);
    if (next <= toDateStr(new Date())) setDate(next);
  }

  const today = toDateStr(new Date());
  input.max   = today;

  input.addEventListener('change', () => setDate(input.value));
  btnPrev.addEventListener('click', () => shiftDay(-1));
  btnNext.addEventListener('click', () => shiftDay(1));

  setDate(today);
}

// ── Actieve vluchten viewer ───────────────────────────────────────────────────

function fmtElapsed(startMs) {
  if (!startMs) return '—';
  const sec = Math.round((Date.now() - startMs) / 1000);
  if (sec < 0) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}u ${String(m).padStart(2, '0')}m`;
  return `${m} min`;
}

function renderActiefEmpty() {
  return `<div class="flights-empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
    <p>Op dit moment zijn er <strong>geen ZC Flevo toestellen in de lucht</strong>.</p>
    <p class="flights-empty-sub">Deze pagina ververst zichzelf elke 30 seconden.</p>
  </div>`;
}

function renderActiefTable(flights) {
  const rows = flights.map(f => {
    const callsign  = f.plane?.callsign || f.plane?.registration || '?';
    const planeName = f.plane?.name || '';

    const commanderCell = f.commander?.name
      ? `${f.commander.name} ${statusBadge(f.commander.status)}`
      : '—';

    const passengerCell = f.passenger?.name
      ? `${f.passenger.name} ${statusBadge(f.passenger.status)}`
      : '<span class="text-muted">enkel</span>';

    return `<tr>
      <td><strong>${callsign}</strong><br><small class="text-muted">${planeName}</small></td>
      <td>${commanderCell}</td>
      <td>${passengerCell}</td>
      <td>${shortType(f.type)}</td>
      <td>${fmtTime(f.startTime)}</td>
      <td><strong>${fmtElapsed(f.startTime)}</strong></td>
    </tr>`;
  }).join('');

  return `
    <div class="flights-summary">
      <span class="flight-badge flight-badge--air">In de lucht</span>
      <strong>${flights.length}</strong> ZC Flevo ${flights.length === 1 ? 'toestel' : 'toestellen'} actief
    </div>
    <div class="flights-table-wrap">
      <table class="flights-table">
        <thead><tr>
          <th>Vliegtuig</th>
          <th>Gezagvoerder</th>
          <th>Mede-inzittende</th>
          <th>Type vlucht</th>
          <th>Start</th>
          <th>In de lucht</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/**
 * Initialiseer de "actieve vluchten" viewer (Startplank, alleen de
 * vluchten die nu in de lucht zijn). Polling elke 30 seconden.
 * @param {object} ids
 * @param {string} ids.appId  ID van het container-element
 */
function initStartplankActiefViewer(ids = {}) {
  const appId = ids.appId || 'startplank-actief-app';
  const app   = document.getElementById(appId);
  if (!app) return;

  let timer = null;

  async function load(silent = false) {
    if (!silent) app.innerHTML = renderLoading();
    try {
      const today = toDateStr(new Date());
      const data  = await fetchFlights(today);
      const flights = data
        ? Object.values(data)
            .filter(f => isClub(f.plane?.registration))
            .filter(f => f.startTime && !f.endTime)
            .sort((a, b) => (a.startTime || 0) - (b.startTime || 0))
        : [];
      app.innerHTML = flights.length ? renderActiefTable(flights) : renderActiefEmpty();
    } catch (err) {
      console.warn('Actieve vluchten fout:', err);
      if (!silent) app.innerHTML = renderError();
    }
  }

  // Initieel laden + polling elke POLL_MS (30s)
  load();
  timer = setInterval(() => load(true), POLL_MS);
}

// Expose voor expliciete init op nieuwe gecombineerde pagina
window.ZCFlevo = window.ZCFlevo || {};
window.ZCFlevo.initStartplankViewer = initStartplankViewer;
window.ZCFlevo.initStartplankActiefViewer = initStartplankActiefViewer;

// Auto-init op pagina's met de standaard IDs (oude startlijst-pagina).
// Op de gecombineerde vluchten-pagina bestaan deze IDs niet, dus geen botsing.
if (document.getElementById('flights-app') && document.getElementById('flight-date')) {
  initStartplankViewer();
}

})();
