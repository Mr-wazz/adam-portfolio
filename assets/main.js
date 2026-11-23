(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var title = document.querySelector('.kinetic');
  var rows = title ? Array.prototype.slice.call(title.querySelectorAll('.kinetic__row')) : [];
  var chars = title ? Array.prototype.slice.call(title.querySelectorAll('.ch')) : [];

  // Fit the title to the content width: the widest row fills it exactly.
  function fit() {
    if (!title) return;
    title.style.fontSize = '100px';
    var avail = title.clientWidth;
    var widest = 0;
    rows.forEach(function (r) {
      var w = 0;
      Array.prototype.forEach.call(r.children, function (c) { w += c.getBoundingClientRect().width; });
      widest = Math.max(widest, w);
    });
    if (widest > 0) title.style.fontSize = (100 * avail / widest * 0.985).toFixed(2) + 'px';
  }

  // Intro: letters rise from below, 45ms apart, 1.1s each.
  function intro() {
    if (!title) return;
    fit();
    if (reduce) { title.classList.add('is-in'); return; }
    chars.forEach(function (c, i) {
      c.style.transition = 'transform 1.1s cubic-bezier(0.19, 1, 0.22, 1) ' + (i * 45) + 'ms';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { title.classList.add('is-in'); });
    });
    var total = 1100 + chars.length * 45 + 100;
    setTimeout(function () {
      chars.forEach(function (c) { c.style.transition = 'none'; });
      if (fine) startCursor();
    }, total);
  }

  // Cursor: letters near the pointer get bolder, wider and lift a little.
  function startCursor() {
    var state = chars.map(function () { return { k: 0 }; });
    var mx = -9999, my = -9999, lastX = null, skew = 0, targetSkew = 0, running = false, active = false;
    var RADIUS = 220;
    title.addEventListener('mousemove', function (e) {
      if (lastX !== null) targetSkew = Math.max(-0.7, Math.min(0.7, (e.clientX - lastX) * 0.05));
      lastX = e.clientX; mx = e.clientX; my = e.clientY; active = true; kick();
    });
    title.addEventListener('mouseleave', function () { active = false; lastX = null; targetSkew = 0; kick(); });
    function kick() { if (!running) { running = true; requestAnimationFrame(tick); } }
    function tick() {
      var moving = false;
      skew += (targetSkew - skew) * 0.15; targetSkew *= 0.9;
      if (Math.abs(skew) > 0.01) moving = true;
      chars.forEach(function (c, i) {
        var target = 0;
        if (active) {
          var r = c.getBoundingClientRect();
          var d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
          target = Math.max(0, 1 - d / RADIUS);
          target = target * target * (3 - 2 * target);
        }
        var s = state[i];
        s.k += (target - s.k) * 0.14;
        if (Math.abs(target - s.k) > 0.002) moving = true;
        var k = s.k;
        c.style.fontVariationSettings = '"wght" ' + (640 + 160 * k).toFixed(0) + ', "wdth" ' + (75 + 25 * k).toFixed(1) + ', "opsz" 96';
        c.style.transform = 'translate3d(0,' + (-0.045 * k).toFixed(4) + 'em,0) skewX(' + (skew * k).toFixed(3) + 'deg)';
      });
      if (moving || active) requestAnimationFrame(tick); else running = false;
    }
  }

  if (title) {
    var started = false;
    var go = function () { if (!started) { started = true; intro(); } };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(go);
      setTimeout(go, 2500);
    } else { go(); }
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 120); });
  }

  // Industry filter for the work grid.
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card[data-cat]'));
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      filters.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
      var n = 0;
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        c.hidden = !show;
        if (show) { n++; var num = c.querySelector('.num'); if (num) num.textContent = (n < 10 ? '0' : '') + n; }
      });
    });
  });
})();
