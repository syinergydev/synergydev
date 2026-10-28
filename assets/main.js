(function () {
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 16); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
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
      if (desktop && !reduce) bar.classList.add('run');
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
      if (desktop && !reduce && hslides.length > 1) {
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
