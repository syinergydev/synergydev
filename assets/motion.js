/* SynergyDev v7 — gerak. Dinonaktifkan jika pengguna memilih "kurangi gerak". */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  /* Judul hero dan halaman dalam muncul per baris */
  document.querySelectorAll('.hero h1, .page-head h1').forEach(function (h) {
    var lines = h.innerHTML.split(/<br\s*\/?>/i);
    if (lines.length < 2) {
      lines = [h.innerHTML];
    }
    h.innerHTML = lines.map(function (l) {
      return '<span class="line"><span>' + l.trim() + '</span></span>';
    }).join('');
    var parent = h.closest('.hero, .page-head');
    if (parent) requestAnimationFrame(function () { parent.classList.add('ready'); });
  });

  var targets = document.querySelectorAll('.feature, .work, .card, .list li, .ruled li, .plan, .demo, .principles > div, .steps li, .faq details, .facts, .terms > div, .contact-item, .form-card, .split > .side-body > *, .split > .side-media, .split > figure, .page-figure, .head, .side-body > p, .cta-inner, .map, .demo-teaser, .narrow, .contact-grid > div, .foot > div');
  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = ((i % 3) * 80) + 'ms';
  });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal, .hero-media').forEach(function (el) { io.observe(el); });
  setTimeout(function () {
    document.querySelectorAll('.reveal, .hero-media').forEach(function (el) { el.classList.add('in'); });
  }, 4000);

  /* Angka statistik naik perlahan */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, txt = el.textContent.trim(), m = txt.match(/^(\d+)(%?)$/);
      if (!m) return;
      var end = parseInt(m[1], 10), suf = m[2], t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / 1200), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        el.textContent = v + suf;
        if (k < 1) requestAnimationFrame(step);
      }
      el.textContent = '0' + suf;
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.facts dd').forEach(function (el) { cio.observe(el); });

  /* Foto hero bergerak perlahan saat di-scroll */
  var img = document.querySelector('.hero-media img');
  if (img && window.innerWidth > 760) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (r.top + r.height) / (innerHeight + r.height);
        img.style.transform = 'translate3d(0,' + ((p - 0.5) * -56).toFixed(1) + 'px,0) scale(1.02)';
      });
    }, { passive: true });
  }
})();
