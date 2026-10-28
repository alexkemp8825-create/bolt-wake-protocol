/* ==== CONFIG — edit these ==================================================
 * TODO: BUTTONDOWN_USERNAME: your Buttondown username (replaces USERNAME in
 *       https://buttondown.com/api/emails/embed-subscribe/USERNAME). Leave ''
 *       to keep the "not connected yet" message.
 * TODO: YOUTUBE_URL: channel URL, e.g. 'https://www.youtube.com/@...'. Leave ''
 *       to keep the YouTube links hidden.
 * Trailer source lives in index.html: <div class="trailer" data-video="video/trailer.mp4" data-youtube-id="">
 *   (data-video wins; clear it to use a YouTube ID instead)
 * ========================================================================== */
var BUTTONDOWN_USERNAME = '';
var YOUTUBE_URL = '';

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
