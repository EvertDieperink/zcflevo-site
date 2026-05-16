---
title: "Rondje"
description: "Wie heeft vandaag op het veld de langste vlucht gemaakt? Die is een rondje verschuldigd."
robots: "noindex, nofollow"
_build:
  list: never
  render: always
  publishResources: true
---

<div class="rondje-page">

  <div class="rondje-state rondje-state-loading" id="rondje-loading">
    <div class="rondje-beer">🍺</div>
    <p class="rondje-kicker">Even kijken wie vandaag het langste boven is gebleven&hellip;</p>
  </div>

  <div class="rondje-state rondje-state-winner" id="rondje-winner" hidden>
    <div class="rondje-beer">🍺</div>
    <p class="rondje-kicker">De langste vlucht van vandaag is van&hellip;</p>
    <h1 class="rondje-name" id="rondje-name">&nbsp;</h1>
    <p class="rondje-verdict">Een rondje voor de bar! 🍻</p>
    <div class="rondje-details">
      <span class="rondje-pill" id="rondje-duration">&mdash;</span>
      <span class="rondje-pill rondje-pill-plane" id="rondje-plane">&mdash;</span>
    </div>
    <p class="rondje-footer">
      Vluchtdata via DSA Startplank &middot; laatst bijgewerkt om
      <span id="rondje-updated">--:--</span> &middot;
      <a href="#" id="rondje-refresh">handmatig verversen</a>
    </p>
  </div>

  <div class="rondje-state rondje-state-empty" id="rondje-empty" hidden>
    <div class="rondje-beer rondje-beer-empty">🍺</div>
    <p class="rondje-kicker">Nog geen volledige vluchten van ZC&nbsp;Flevo vandaag.</p>
    <h1 class="rondje-name">Niemand (nog)</h1>
    <p class="rondje-verdict">Eerst eens lekker vliegen. De bar wacht wel.</p>
    <p class="rondje-footer">Vluchtdata via DSA Startplank &middot; <a href="#" id="rondje-refresh-empty">verversen</a></p>
  </div>

  <div class="rondje-state rondje-state-error" id="rondje-error" hidden>
    <div class="rondje-beer">🍺</div>
    <p class="rondje-kicker">Oeps, de startlijst is even niet bereikbaar.</p>
    <p class="rondje-verdict">Probeer het zo nog eens.</p>
    <p class="rondje-footer"><a href="#" id="rondje-refresh-error">opnieuw proberen</a></p>
  </div>

</div>

<style>
.rondje-page {
  max-width: 640px;
  margin: 2rem auto 4rem;
  padding: 3rem 1.5rem;
  text-align: center;
  background: linear-gradient(160deg, #fafcff 0%, #eef4fb 100%);
  border-radius: var(--radius-lg, 14px);
  box-shadow: 0 8px 32px rgba(5, 107, 179, 0.08);
}

.rondje-state[hidden] { display: none; }

.rondje-beer {
  font-size: 6rem;
  display: inline-block;
  line-height: 1;
  margin-bottom: 1rem;
  animation: rondje-tilt 2.6s ease-in-out infinite;
  transform-origin: 50% 80%;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
}

.rondje-beer-empty {
  animation: rondje-flat 4s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes rondje-tilt {
  0%, 100% { transform: rotate(-8deg); }
  50%      { transform: rotate(8deg);  }
}

@keyframes rondje-flat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

.rondje-kicker {
  font-size: 1.05rem;
  color: var(--text-muted, #6a737d);
  margin: 0.5rem 0 0.75rem;
  font-style: italic;
}

.rondje-name {
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  color: var(--blue, #056BB3);
  margin: 0.25rem 0;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.rondje-state-empty .rondje-name {
  color: var(--text-muted, #6a737d);
  font-size: clamp(1.6rem, 4vw, 2.2rem);
}

.rondje-verdict {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--red, #E21F26);
  margin: 0.5rem 0 1.75rem;
}

.rondje-state-empty .rondje-verdict {
  color: var(--text, #1a1a1a);
  font-weight: 500;
  font-size: 1rem;
}

.rondje-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 1.25rem 0 1.5rem;
}

.rondje-pill {
  display: inline-block;
  padding: 0.5rem 1.1rem;
  background: #fff;
  border: 1px solid rgba(5, 107, 179, 0.18);
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--blue-dark, #235696);
  box-shadow: 0 2px 6px rgba(5, 107, 179, 0.06);
}

.rondje-pill-plane {
  background: var(--blue, #056BB3);
  color: #fff;
  border-color: transparent;
}

.rondje-footer {
  margin-top: 2rem;
  font-size: 0.82rem;
  color: var(--text-muted, #6a737d);
  line-height: 1.5;
}

.rondje-footer a {
  color: var(--blue, #056BB3);
  text-decoration: underline;
}
</style>

<script>
(function () {
  'use strict';

  // ZC Flevo vliegtuig-registraties (zelfde lijst als in startlijst.js).
  var CLUB_REG_ZC = ['PH-1433', 'PH-974', 'PH-1382', 'PH-1006', 'PH-1273', 'PH-1210', 'PH-1571'];
  var DB_URL      = 'https://dsa-startplank.firebaseio.com';
  var POLL_MS     = 60000;

  function todayStr() {
    // Gebruik lokale datum (Europe/Amsterdam) — niet UTC, anders krijg je
    // 's avonds laat al de "volgende dag" terwijl er nog wordt gevlogen.
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dd;
  }

  function normalize(reg) {
    return (reg || '').replace(/[\s-]/g, '').toUpperCase();
  }

  function isClub(reg) {
    var n = normalize(reg);
    return CLUB_REG_ZC.some(function (r) { return normalize(r) === n; });
  }

  /**
   * "Evert Dieperink"      -> "Evert D."
   * "Hans van Zandvoort"   -> "Hans Z."
   * "Stan"                 -> "Stan"
   * Voornaam + eerste letter van het laatste woord van de naam.
   */
  function voornaamAchterletter(name) {
    if (!name) return 'Iemand';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    var v = parts[0];
    var laatste = parts[parts.length - 1];
    return v + ' ' + laatste.charAt(0).toUpperCase() + '.';
  }

  function fmtDuration(ms) {
    var sec = Math.round(ms / 1000);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    if (h > 0) return h + 'u ' + String(m).padStart(2, '0') + 'm';
    return m + ' min';
  }

  function fmtNow() {
    return new Date().toLocaleTimeString('nl-NL', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam'
    });
  }

  function show(which) {
    ['loading', 'winner', 'empty', 'error'].forEach(function (id) {
      var el = document.getElementById('rondje-' + id);
      if (!el) return;
      if (id === which) el.removeAttribute('hidden');
      else              el.setAttribute('hidden', '');
    });
  }

  async function load() {
    var date = todayStr();
    var data;
    try {
      var res = await fetch(DB_URL + '/flydays/' + date + '/flights.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      data = await res.json();
    } catch (e) {
      show('error');
      return;
    }

    // Firebase geeft of een object terug ({id: flight}) of null als er niks is.
    var flights = data ? Object.values(data) : [];

    // Alleen ZC-vluchten die compleet zijn (start + landing geregistreerd).
    var completed = flights.filter(function (f) {
      return f && f.commander && f.commander.name
        && f.startTime && f.endTime && f.endTime > f.startTime
        && f.plane && isClub(f.plane.registration);
    });

    if (completed.length === 0) {
      show('empty');
      return;
    }

    // Langste vlucht zoeken.
    var winner = completed.reduce(function (best, f) {
      var dur = f.endTime - f.startTime;
      var bestDur = best.endTime - best.startTime;
      return dur > bestDur ? f : best;
    });
    var winnerDur = winner.endTime - winner.startTime;

    document.getElementById('rondje-name').textContent =
      voornaamAchterletter(winner.commander.name);
    document.getElementById('rondje-duration').textContent =
      fmtDuration(winnerDur);

    var cs   = winner.plane.callsign || '';
    var reg  = winner.plane.registration || '';
    var type = winner.plane.name || '';
    var planeStr = cs ? cs : (reg || '?');
    if (reg && cs) planeStr += ' (' + reg + ')';
    if (type)      planeStr += ' · ' + type;
    document.getElementById('rondje-plane').textContent = planeStr;

    document.getElementById('rondje-updated').textContent = fmtNow();
    show('winner');
  }

  function wireRefresh(id) {
    var a = document.getElementById(id);
    if (!a) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show('loading');
      load();
    });
  }

  load();
  wireRefresh('rondje-refresh');
  wireRefresh('rondje-refresh-empty');
  wireRefresh('rondje-refresh-error');
  setInterval(load, POLL_MS);
})();
</script>
