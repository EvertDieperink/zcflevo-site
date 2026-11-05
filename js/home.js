/* ZC Flevo · Homepage: wisselende hero-foto's, fade-in bij scrollen en de
   vliegroute (stippellijn die met het scrollen "gevlogen" wordt).
   Alle content is ook zonder JavaScript zichtbaar. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: foto wisselt elke 7 seconden met een zachte overgang.
     Niet bij "beperkte beweging", en gepauzeerd als het tabblad niet zichtbaar is. */
  (function () {
    var slides = [].slice.call(document.querySelectorAll('.hp-hero-slide'));
    var dots = [].slice.call(document.querySelectorAll('.hp-hero-dot'));
    if (slides.length < 2) return;
    var current = 0, timer = null, DELAY = 7000;

    function show(i) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      if (dots[current]) dots[current].removeAttribute('aria-current');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].removeAttribute('aria-hidden');
      if (dots[current]) dots[current].setAttribute('aria-current', 'true');
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reduce || document.hidden) return;
      timer = setInterval(function () { show(current + 1); }, DELAY);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); start(); });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  })();

  /* Fade-in: op basis van scrollpositie, zodat ook snel scrollen of ankers altijd alles tonen */
  var els = [].slice.call(document.querySelectorAll('.hp-reveal, .hp-wp'));
  function reveal() {
    var vh = window.innerHeight;
    els = els.filter(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.88) { el.classList.add('hp-in'); return false; }
      return true;
    });
  }
  reveal();
  window.addEventListener('scroll', reveal, { passive: true });

  /* Vliegroute: stippellijn loopt tussen de foto-banden door en verbindt de waypoint-nummers */
  var track = document.getElementById('hp-track');
  if (!track) return;
  var svg = document.getElementById('hp-route-svg'),
      pD = document.getElementById('hp-p-dots'),
      pF = document.getElementById('hp-p-flown'),
      pM = document.getElementById('hp-p-mask'),
      wps = [].slice.call(track.querySelectorAll('.hp-wp')),
      len = 0, marks = [];

  function rel(el) {
    var t = track.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - t.left + r.width / 2, y: r.top - t.top + r.height / 2, top: r.top - t.top, bottom: r.bottom - t.top };
  }
  function bottomOf(wp) {
    var a = rel(wp.querySelector('.hp-photo')).bottom, b = rel(wp.querySelector('.hp-card')).bottom;
    return Math.max(a, b);
  }
  function build() {
    var w = track.offsetWidth, h = track.offsetHeight;
    svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var s = rel(document.querySelector('#hp-start .hp-ring')), d = 'M' + s.x + ' ' + s.y, prev = s, prevBottom = s.y;
    marks = [];
    wps.forEach(function (wp) {
      var m = rel(wp.querySelector('.hp-dot')), g = m.y - prevBottom;
      d += ' L' + prev.x + ' ' + prevBottom + ' C' + prev.x + ' ' + (prevBottom + g * 0.72) + ' ' + m.x + ' ' + (m.y - g * 0.72) + ' ' + m.x + ' ' + m.y;
      marks.push({ wp: wp, y: m.y });
      prev = m; prevBottom = bottomOf(wp) + 8;
    });
    var f = rel(document.querySelector('#hp-finish .hp-flag')), g2 = f.y - prevBottom;
    d += ' L' + prev.x + ' ' + prevBottom + ' C' + prev.x + ' ' + (prevBottom + g2 * 0.72) + ' ' + f.x + ' ' + (f.y - g2 * 0.72) + ' ' + f.x + ' ' + f.y;
    pD.setAttribute('d', d); pF.setAttribute('d', d); pM.setAttribute('d', d);
    len = pD.getTotalLength();
    pM.style.strokeDasharray = len + ' ' + (len + 20);
    update();
  }
  function update() {
    if (!len) return;
    var t = track.getBoundingClientRect(), vh = window.innerHeight, mid = vh * 0.6;
    var y = mid - t.top, p = Math.max(0, Math.min(1, y / t.height));
    /* zoek de lengte op de route die bij deze hoogte hoort */
    var lo = 0, hi = len;
    for (var i = 0; i < 18; i++) { var m = (lo + hi) / 2; if (pD.getPointAtLength(m).y < y) lo = m; else hi = m; }
    var flown = p >= 1 ? len : (p <= 0 ? 0 : lo);
    pM.style.strokeDashoffset = len - flown;
    marks.forEach(function (k) {
      k.wp.classList.toggle('hp-reached', y >= k.y);
      var r = k.wp.getBoundingClientRect();
      k.wp.classList.toggle('hp-active', r.top < mid && r.bottom > mid);
    });
  }
  var raf = null;
  window.addEventListener('scroll', function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; update(); });
  }, { passive: true });
  if ('ResizeObserver' in window) { new ResizeObserver(build).observe(track); } else { window.addEventListener('resize', build); }
  window.addEventListener('load', build);
  build();
})();
