(function () {
  var header = document.querySelector('.top');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    function closeMenu() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Buka menu');
    }
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 961px)').matches) closeMenu();
    });
  }

  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('#projectGrid [data-cat]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cards.forEach(function (c) {
        c.style.display = (f === 'All' || c.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var hslides = hero.querySelectorAll('.hslide');
    var hdots = hero.querySelectorAll('.hero-dots span');
    var bar = hero.querySelector('.hero-progress');
    var DURATION = 6000;
    var cur = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var desktop = window.matchMedia && window.matchMedia('(min-width: 761px)').matches;
    function runProgress() {
      if (!bar) return;
      bar.classList.remove('run');
      void bar.offsetWidth;
      if (!reduce) bar.classList.add('run');
    }
    function go(i) {
      hslides[cur].classList.remove('active');
      hdots[cur] && hdots[cur].classList.remove('on');
      cur = (i + hslides.length) % hslides.length;
      hslides[cur].classList.add('active');
      hdots[cur] && hdots[cur].classList.add('on');
      runProgress();
    }
    function start() {
      clearInterval(timer);
      if (!reduce && hslides.length > 1 && !document.hidden) {
        timer = setInterval(function () { go(cur + 1); }, DURATION);
      }
    }
    hdots.forEach(function (d, i) {
      d.addEventListener('click', function () { go(i); start(); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Enter') { go(i); start(); } });
    });
    if (desktop) {
      hero.addEventListener('mouseenter', function () { clearInterval(timer); });
      hero.addEventListener('mouseleave', start);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer);
      else start();
    });
    var sx = null, sy = null;
    hero.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        go(cur + (dx < 0 ? 1 : -1));
        start();
      }
    }, { passive: true });
    var mdots = hero.querySelectorAll('.hero-mdots span');
    var track = hero.querySelector('.hero-slides');
    if (track && mdots.length) {
      track.addEventListener('scroll', function () {
        var first = track.firstElementChild;
        if (!first) return;
        var step = first.offsetWidth + 14;
        var idx = Math.min(mdots.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
        mdots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
      }, { passive: true });
    }
    runProgress();
    start();
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  var form = document.getElementById('contactForm');
  var errorEl = document.getElementById('formError');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, contact = form.elements.contact;
      var ok = true;
      [name, contact].forEach(function (el) {
        var v = el.value.trim();
        var valid = v.length > 0 && (el === name || v.length >= 6);
        el.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        errorEl.textContent = 'Mohon lengkapi nama dan email atau nomor WhatsApp.';
        (name.classList.contains('invalid') ? name : contact).focus();
        return;
      }
      errorEl.textContent = '';
      var lines = [
        'Halo SynergyDev, saya ingin konsultasi mengenai website.',
        '',
        'Nama: ' + name.value.trim(),
        'Nama Bisnis: ' + (form.elements.business.value.trim() || '-'),
        'Email / WhatsApp: ' + contact.value.trim(),
        'Jenis Website: ' + (form.elements.type.value || '-'),
        '',
        'Pesan:',
        form.elements.message.value.trim() || '-'
      ];
      window.open('https://wa.me/6285737681560?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();


/* v8: video portofolio hanya diputar saat terlihat di layar */
(function () {
  var vids = document.querySelectorAll('video.vid-el');
  if (!vids.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        v.muted = true;
        if (v.preload === 'none') v.preload = 'auto';
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.3 });
  vids.forEach(function (v) { io.observe(v); });
})();


/* v9: bilah progres scroll */
(function () {
  var bar = document.querySelector('.progress');
  if (!bar) return;
  var queued = false;
  function update() {
    queued = false;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? (h.scrollTop / max) : 0).toFixed(4) + ')';
  }
  window.addEventListener('scroll', function () {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* v9: bingkai video sedikit miring mengikuti kursor (hanya perangkat dengan mouse) */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || (window.matchMedia && window.matchMedia('(hover: none)').matches)) return;
  document.querySelectorAll('.vid').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', function () {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
})();

/* v10: tombol "Kembali ke atas" (menghormati kurangi gerak lewat CSS scroll-behavior) */
(function () {
  document.querySelectorAll('[data-to-top]').forEach(function (b) {
    b.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
