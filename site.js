/* ==== CONFIG — edit these ==================================================
 * TODO: BUTTONDOWN_USERNAME: your Buttondown username (replaces USERNAME in
 *       https://buttondown.com/api/emails/embed-subscribe/USERNAME). Leave ''
 *       to keep the "not connected yet" message.
 * TODO: YOUTUBE_URL: channel URL, e.g. 'https://www.youtube.com/@...'. Leave ''
 *       to keep the YouTube links hidden.
 * Trailer source lives in index.html: <div class="trailer" data-video="trailer.mp4" data-youtube-id="">
 *   (data-video wins; clear it to use a YouTube ID instead)
 * ========================================================================== */
var BUTTONDOWN_USERNAME = '';
var YOUTUBE_URL = 'https://www.youtube.com/@boltwakeprotocol';

(function () {
  var form = document.getElementById('signup');
  if (form) {
    if (BUTTONDOWN_USERNAME) {
      form.action = 'https://buttondown.com/api/emails/embed-subscribe/' + encodeURIComponent(BUTTONDOWN_USERNAME);
      form.addEventListener('submit', function () {
        document.getElementById('note').textContent = '> SIGNAL SENT — CHECK YOUR INBOX TO CONFIRM';
      });
    } else {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        document.getElementById('note').textContent = '> SIGN-UP NOT CONNECTED YET — CHECK BACK SOON';
      });
    }
  }
  if (YOUTUBE_URL) {
    document.querySelectorAll('.yt-link').forEach(function (a) { a.href = YOUTUBE_URL; a.hidden = false; });
  }
  document.querySelectorAll('.trailer[data-youtube-id]').forEach(function (box) {
    var src = (box.getAttribute('data-video') || '').trim();
    if (src) {
      var v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.preload = 'metadata';
      v.setAttribute('playsinline', ''); v.setAttribute('preload', 'metadata');
      var poster = box.getAttribute('data-poster'); if (poster) v.poster = poster;
      var s = document.createElement('source'); s.src = src; s.type = 'video/mp4'; v.appendChild(s);
      v.setAttribute('aria-label', 'BOLT – Wake Protocol trailer');
      box.innerHTML = ''; box.appendChild(v); return;
    }
    var id = (box.getAttribute('data-youtube-id') || '').trim();
    if (!/^[\w-]{6,20}$/.test(id)) return; // empty/invalid → keep placeholder
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0';
    f.title = 'BOLT – Wake Protocol trailer';
    f.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    f.allowFullscreen = true; f.loading = 'lazy';
    box.innerHTML = ''; box.appendChild(f);
  });
})();

/* ==== v3 video hero ==== */
(function () {
  var hero = document.querySelector('.vhero'); if (!hero) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var vid = hero.querySelector('.vh-video');
  if (reduce && vid) { vid.pause(); vid.removeAttribute('autoplay'); vid.preload = 'none'; }
  else if (vid) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }

  // typed boot sequence
  var term = hero.querySelector('.vh-term');
  if (term && !reduce) {
    var full = term.textContent, i = 0; term.textContent = ''; term.classList.add('typing');
    (function type() {
      i++; term.textContent = full.slice(0, i);
      if (i < full.length) setTimeout(type, full[i - 1] === '\n' ? 260 : (full[i - 1] === '.' ? 18 : 38));
      else setTimeout(function () { term.classList.remove('typing'); }, 1600);
    })();
  }

  // trailer modal
  var modal = document.querySelector('.vh-modal'), mv = modal && modal.querySelector('video'), lastFocus;
  function openM() { if (!modal) return; lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden';
    if (vid) vid.pause(); mv.currentTime = 0; var p = mv.play(); if (p && p.catch) p.catch(function () {}); modal.querySelector('.vh-close').focus(); }
  function closeM() { if (!modal || modal.hidden) return; mv.pause(); modal.hidden = true; document.body.style.overflow = '';
    if (vid && !reduce) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } if (lastFocus) lastFocus.focus(); }
  var w = hero.querySelector('.vh-watch'); if (w) w.addEventListener('click', function (e) { e.stopPropagation(); openM(); });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeM(); });
    modal.querySelector('.vh-close').addEventListener('click', closeM);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeM(); });
  }
  if (reduce) return;

  // parallax + reticle
  var layers = hero.querySelectorAll('[data-depth]'), ret = hero.querySelector('.vh-reticle'), raf = 0, mx = 0, my = 0, px = 0, py = 0;
  if (fine) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
      mx = px / r.width - .5; my = py / r.height - .5;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0;
        layers.forEach(function (l) { var d = +l.getAttribute('data-depth'); l.style.transform = 'translate3d(' + (-mx * d) + 'px,' + (-my * d) + 'px,0)'; });
        ret.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
        hero.style.setProperty('--mx', px + 'px'); hero.style.setProperty('--my', py + 'px');
      });
    });
    hero.addEventListener('mouseenter', function () { hero.classList.add('has-reticle'); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('has-reticle'); });
  }

  // hex-burst particles
  var cv = hero.querySelector('.vh-fx'), ctx = cv && cv.getContext('2d'), parts = [], running = false, dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (!ctx) return;
  function size() { cv.width = hero.clientWidth * dpr; cv.height = hero.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); window.addEventListener('resize', size);
  function hex(x, y, r, a) { ctx.beginPath(); for (var k = 0; k < 6; k++) { var t = a + k * Math.PI / 3; ctx[k ? 'lineTo' : 'moveTo'](x + r * Math.cos(t), y + r * Math.sin(t)); } ctx.closePath(); }
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      p.life -= 1 / 60; var k = Math.max(p.life / p.max, 0);
      ctx.globalAlpha = k;
      if (p.ring) { p.r += 3.2; hex(p.x, p.y, p.r, p.a); ctx.strokeStyle = '#CCFF00'; ctx.lineWidth = 2; ctx.stroke(); }
      else { p.x += p.vx; p.y += p.vy; p.vx *= .95; p.vy *= .95; p.a += p.va; hex(p.x, p.y, p.r * (0.4 + k * .6), p.a);
        if (p.fill) { ctx.fillStyle = '#CCFF00'; ctx.fill(); } else { ctx.strokeStyle = '#CCFF00'; ctx.lineWidth = 1.2; ctx.stroke(); } }
    });
    ctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(loop); else running = false;
  }
  hero.addEventListener('click', function (e) {
    if (e.target.closest('a,button')) return;
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    parts.push({ ring: 1, x: x, y: y, r: 6, a: Math.PI / 6, life: .55, max: .55 });
    for (var n = 0; n < 22; n++) { var ang = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5;
      parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r: 3 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - .5) * .2, fill: Math.random() < .5, life: .6 + Math.random() * .6, max: 1.2 }); }
    if (!running) { running = true; requestAnimationFrame(loop); }
  });
})();
