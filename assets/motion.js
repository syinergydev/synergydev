/* SynergyDev v10 — motion design (GSAP 3 + ScrollTrigger).
   Aktif hanya bila: GSAP termuat, kelas .js-motion terpasang oleh skrip di <head>,
   dan pengguna TIDAK memilih "kurangi gerak". Selain itu situs tampil statis & utuh. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger || !root.classList.contains('js-motion')) {
    root.classList.remove('js-motion', 'curtain-on', 'intro');
    return;
  }
  window.__sdMotion = true;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });

  var REVEAL = '.head > p,.feature,.card,.demo-teaser,.list li,.ruled li,.side-body > p,.more,.facts > div,.principles > div,.steps li,.plan,.note,.terms > div,.portfolio-intro,.filters,.work,.demo,.footnote,.faq details,.contact-grid > div > h2,.contact-grid > div > p,.contact-item,.contact-actions,.form-card,.map,.figcap,.cta-inner > p,.cta-inner > .btn,.foot > div,.foot-bottom';
  var HEADINGS = '.hero h1,.page-head h1,h2.display-2,.display-3';
  var HERO_H1 = '.hero h1, .page-head h1';

  var $ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var store = null;
  try { store = window.sessionStorage; } catch (e) {}
  var curtain = document.querySelector('.curtain');
  var curtainLogo = curtain && curtain.querySelector('.curtain-logo');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var narrow = window.matchMedia('(max-width: 760px)').matches;
  var navigating = false;
  var failed = false;

  function noTrans(els, on) { els.forEach(function (el) { el.style.transition = on ? 'none' : ''; }); }

  /* Pecah teks jadi kata. mask=true -> tiap kata dibungkus pelindung overflow (reveal naik) */
  function splitWords(el, mask) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var inner = document.createElement('span');
            inner.textContent = part;
            if (mask) {
              var w = document.createElement('span');
              w.className = 'w'; inner.className = 'w-i';
              w.appendChild(inner); frag.appendChild(w);
            } else {
              inner.className = 'sw'; frag.appendChild(inner);
            }
            out.push(inner);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    })(el);
    return out;
  }

  /* Jalankan sekali saat masuk viewport; bila halaman dimuat sudah melewati elemen, langsung ke keadaan akhir */
  function once(trigger, start, play, final) {
    var played = false;
    ScrollTrigger.create({
      trigger: trigger, start: start, once: true,
      onEnter: function () { played = true; play(); },
      onLeave: function () { if (!played) final(); }
    });
  }

  function bail(err) {
    failed = true;
    if (window.console) console.error('[motion]', err);
    root.classList.remove('js-motion', 'curtain-on', 'intro');
    root.style.overflow = '';
    gsap.set($(HEADINGS + ', ' + REVEAL + ', .hero .kicker, .hero .lead, .hero-cta .btn, .spin-badge, .page-head .lead'), { clearProps: 'all' });
    $('.w-i').forEach(function (n) { n.style.transform = 'none'; });
  }
  function safe(fn) { try { fn(); } catch (err) { bail(err); } }

  /* ---------- Judul: pecah kata & siapkan keadaan awal ---------- */
  var headings = [];
  safe(function () {
    headings = $(HEADINGS).map(function (h) {
      var words = splitWords(h, true);
      gsap.set(words, { yPercent: 118 });
      gsap.set(h, { visibility: 'visible' });
      return { el: h, words: words };
    });
  });

  /* ---------- Hero / kepala halaman ---------- */
  function heroIn() {
    safe(function () {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      var h1 = headings.filter(function (h) { return h.el.matches(HERO_H1); })[0];
      if (h1) tl.to(h1.words, { yPercent: 0, duration: 1.4, stagger: 0.07 }, 0);

      tl.fromTo('.hero .kicker', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.05);
      tl.fromTo('.hero .lead, .page-head .lead', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.4);

      var btns = $('.hero-cta .btn');
      noTrans(btns, true);
      tl.fromTo(btns, { y: 26, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.1,
        onComplete: function () { noTrans(btns, false); gsap.set(btns, { clearProps: 'transform' }); }
      }, 0.55);

      var hm = document.querySelector('.hero-media');
      if (hm) {
        var himg = hm.querySelector('img');
        tl.to(hm, { '--cv': 0, duration: 1.5, ease: 'expo.inOut' }, 0.25);
        if (himg) tl.fromTo(himg, { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.25);
      }
      tl.fromTo('.spin-badge', { scale: 0.2, opacity: 0, rotate: -120 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.5)' }, 1.1);
      tl.to('.page-head .wrap', { '--rule': 1, duration: 1.5, ease: 'expo.inOut' }, 0.5);
    });
  }

  /* ---------- Tirai: pemuatan singkat & transisi halaman ---------- */
  function endCurtain() {
    root.classList.remove('curtain-on', 'intro');
    root.style.overflow = '';
    if (curtain) gsap.set(curtain, { clearProps: 'all' });
    if (curtainLogo) gsap.set(curtainLogo, { clearProps: 'all' });
    ScrollTrigger.refresh();
  }

  function runIntro() {
    var cnt = curtain.querySelector('[data-count]');
    var bar = curtain.querySelector('.curtain-bar');
    var o = { v: 0 };
    root.style.overflow = 'hidden';
    if (store) { try { store.setItem('sd-seen', '1'); } catch (e) {} }
    gsap.timeline({ onComplete: endCurtain })
      .fromTo(curtainLogo, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, 0)
      .to(o, { v: 100, duration: 1, ease: 'power2.inOut', onUpdate: function () { cnt.textContent = Math.round(o.v); } }, 0)
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0)
      .to(curtainLogo, { y: -18, opacity: 0, duration: 0.4, ease: 'power2.in' }, 1.05)
      .to(curtain, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 1.2)
      .call(heroIn, null, 1.6);
  }

  function runArrival() {
    if (store) { try { store.removeItem('sd-nav'); } catch (e) {} }
    gsap.set(curtain, { yPercent: 0 });
    gsap.timeline({ delay: 0.08, onComplete: endCurtain })
      .to(curtainLogo, { y: -14, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(curtain, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 0.2)
      .call(heroIn, null, 0.55);
  }

  function leave(href) {
    var gone = false;
    function go() { if (gone) return; gone = true; window.location.href = href; }
    if (store) { try { store.setItem('sd-nav', '1'); } catch (e) {} }
    gsap.set(curtain, { yPercent: 100 });
    gsap.set(curtainLogo, { opacity: 0, y: 20 });
    root.classList.add('curtain-on');
    gsap.timeline({ onComplete: go })
      .to(curtain, { yPercent: 0, duration: 0.65, ease: 'expo.inOut' }, 0)
      .to(curtainLogo, { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' }, 0.25);
    window.setTimeout(go, 1600);
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    var url;
    try { url = new URL(a.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    e.preventDefault();
    if (navigating) return;
    navigating = true;
    leave(url.href);
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { navigating = false; endCurtain(); }
  });

  /* ---------- Adegan scroll ---------- */
  safe(function () {
    /* Judul section: kata naik bertahap */
    headings.forEach(function (h) {
      if (h.el.matches(HERO_H1)) return;
      once(h.el, 'top 90%',
        function () { gsap.to(h.words, { yPercent: 0, duration: 1.15, stagger: 0.045, ease: 'expo.out' }); },
        function () { gsap.set(h.words, { yPercent: 0 }); });
    });

    /* Konten: muncul berjenjang per kelompok */
    ScrollTrigger.batch(REVEAL, {
      start: 'top 90%', once: true,
      onEnter: function (batch) {
        noTrans(batch, true);
        gsap.fromTo(batch, { y: 46, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true,
          onComplete: function () { noTrans(batch, false); gsap.set(batch, { clearProps: 'transform' }); }
        });
      },
      onLeave: function (batch) { gsap.set(batch, { opacity: 1, clearProps: 'transform' }); }
    });

    /* Gambar: topeng terbuka + zoom-out, lalu parallax halus */
    $('.side-media, .page-figure').forEach(function (fig) {
      var img = fig.querySelector('img');
      once(fig, 'top 88%',
        function () {
          gsap.to(fig, { '--cv': 0, duration: 1.5, ease: 'expo.inOut' });
          if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, ease: 'expo.out' });
        },
        function () { gsap.set(fig, { '--cv': 0 }); });
    });
    var amp = narrow ? 4 : 7;
    $('.hero-media, .side-media, .page-figure').forEach(function (fig) {
      var img = fig.querySelector('img');
      if (!img) return;
      gsap.fromTo(img, { yPercent: -amp }, {
        yPercent: amp, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Hero: teks bergeser lebih lambat, cahaya latar mengikuti scroll */
    var heroSec = document.querySelector('.hero');
    if (heroSec && !narrow) {
      gsap.to('.hero .wrap', { yPercent: -9, ease: 'none', scrollTrigger: { trigger: heroSec, start: 'top top', end: 'bottom top', scrub: true } });
    }
    $('.hero, .page-head').forEach(function (sec) {
      var bg = sec.querySelector('.hero-bg');
      if (!bg) return;
      gsap.to(bg, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
      $('i', bg).forEach(function (g, i) {
        gsap.to(g, { xPercent: i ? 7 : -6, yPercent: i ? -6 : 5, duration: 9 + i * 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    });

    /* Paragraf profil: kata menyala mengikuti scroll */
    var para = document.querySelector('#tentang .side-body > p:not(.eyebrow)');
    if (para) {
      var sw = splitWords(para, false);
      gsap.to(sw, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: para, start: 'top 82%', end: 'bottom 50%', scrub: true } });
    }

    /* Angka statistik (tahun tidak dihitung naik) */
    $('.facts dd').forEach(function (el) {
      var m = el.textContent.trim().match(/^(\d+)(%?)$/);
      if (!m || parseInt(m[1], 10) >= 1000) return;
      var end = parseInt(m[1], 10), suf = m[2], o = { v: 0 };
      el.textContent = '0' + suf;
      once(el, 'top 92%',
        function () { gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v) + suf; } }); },
        function () { el.textContent = end + suf; });
    });

    /* Ticker: kecepatan mengikuti scroll, arah mengikuti arah scroll */
    $('.ticker-track, .marquee-track').forEach(function (track) {
      track.style.animation = 'none';
      var tw = gsap.to(track, { xPercent: -50, ease: 'none', duration: 42, repeat: -1 });
      var target = 1;
      ScrollTrigger.create({
        trigger: track.parentNode, start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) {
          var v = Math.min(Math.abs(self.getVelocity()) / 450, 6);
          target = (self.direction < 0 ? -1 : 1) * (1 + v);
        }
      });
      gsap.ticker.add(function () {
        var ts = tw.timeScale();
        tw.timeScale(ts + (target - ts) * 0.08);
        target += ((target < 0 ? -1 : 1) - target) * 0.04;
      });
    });

    /* Header: sembunyi saat scroll turun, muncul saat scroll naik */
    var hdr = document.querySelector('.top');
    var nav = document.getElementById('mainNav');
    if (hdr) {
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          var y = self.scroll();
          var open = nav && nav.classList.contains('open');
          if (y > 260 && self.direction === 1 && !open) hdr.classList.add('is-hidden');
          else if (self.direction === -1 || y <= 260 || open) hdr.classList.remove('is-hidden');
        }
      });
    }

    /* Footer: wordmark naik saat footer masuk */
    if (document.querySelector('.foot-mark')) {
      gsap.fromTo('.foot-mark', { yPercent: 38 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
      });
    }

    /* Filter portofolio mengubah tinggi halaman -> hitung ulang posisi */
    $('.filter').forEach(function (b) {
      b.addEventListener('click', function () { window.setTimeout(function () { ScrollTrigger.refresh(); }, 60); });
    });
  });

  /* ---------- Interaksi: tombol magnetik & cahaya hero mengikuti kursor ---------- */
  if (fine) {
    safe(function () {
      $('.btn, .pill, .wa-float').forEach(function (el) {
        var xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        var yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.34);
        });
        el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
      });

      var glows = $('.hero-bg i');
      if (glows.length) {
        var qs = glows.map(function (g) {
          return { x: gsap.quickTo(g, 'x', { duration: 1.8, ease: 'power3.out' }), y: gsap.quickTo(g, 'y', { duration: 1.8, ease: 'power3.out' }) };
        });
        window.addEventListener('pointermove', function (e) {
          var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
          qs.forEach(function (q, i) { var d = i ? -1 : 1; q.x(nx * 70 * d); q.y(ny * 50 * d); });
        }, { passive: true });
      }
    });
  }

  /* ---------- Mulai ---------- */
  var isIntro = root.classList.contains('intro');
  var onNav = root.classList.contains('curtain-on') && !isIntro;
  if (failed) return;
  if (isIntro && curtain) runIntro();
  else if (onNav && curtain) runArrival();
  else heroIn();

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
    /* Elemen yang sudah terlewat (halaman dimuat di tengah) tidak boleh tertinggal tersembunyi */
    $(REVEAL).forEach(function (el) {
      if (el.getBoundingClientRect().bottom < -50 && getComputedStyle(el).opacity === '0') {
        gsap.set(el, { opacity: 1, clearProps: 'transform' });
      }
    });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
