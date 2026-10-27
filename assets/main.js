(function () {
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 16);
  }
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

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  var form = document.getElementById('inquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var f = new FormData(form);
      var lines = [
        'Halo Risky, saya tertarik dengan layanan website SynergyDev.',
        '',
        'Nama: ' + f.get('name'),
        'Bisnis/Perusahaan: ' + (f.get('company') || '-'),
        'WhatsApp: ' + f.get('whatsapp'),
        'Email: ' + (f.get('email') || '-'),
        'Jenis Project: ' + (f.get('type') || '-'),
        'Range Budget: ' + f.get('budget'),
        '',
        'Pesan:',
        f.get('message') || '-'
      ];
      window.open('https://wa.me/6285737681560?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
