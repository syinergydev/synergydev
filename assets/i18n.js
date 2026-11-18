/* SynergyDev — switcher ID | EN (tahap 1: navigasi, footer, beranda). Bahasa Indonesia default. */
(function () {
  var KEY = 'sd-lang';
  var EN = {
    'Beranda': 'Home', 'Layanan': 'Services', 'Portofolio': 'Portfolio', 'Harga': 'Pricing',
    'Tentang Kami': 'About Us', 'Proses Kerja': 'How We Work', 'FAQ': 'FAQ', 'Kontak': 'Contact',
    'Konsultasi Gratis': 'Free Consultation', 'Konsultasi gratis': 'Free consultation',
    'Konsultasi via WhatsApp': 'Consult via WhatsApp', 'Lihat portofolio': 'View portfolio',
    'Navigasi': 'Navigation', 'Ikuti kami': 'Follow us', 'Kembali ke atas': 'Back to top',
    'Membangun pengalaman digital profesional untuk bisnis.': 'Building professional digital experiences for businesses.',
    'Studio web independen · Lamongan': 'Independent web studio · Lamongan',
    'SynergyDev membantu bisnis, brand, UMKM, hospitality, dan usaha lokal membangun website profesional yang menampilkan layanan, produk, galeri, lokasi, dan kontak dalam satu tempat.':
      'SynergyDev helps businesses, brands, MSMEs, hospitality, and local companies build professional websites that present services, products, galleries, locations, and contact details in one place.',
    'Ceritakan bisnis Anda.': 'Tell us about your business.',
    'Kami bantu menentukan struktur dan fitur website yang paling sesuai.': 'We help you define the structure and features that fit your website best.',
    'Mulai dari satu pesan. Kami bantu menentukan langkah pertama.': 'Start with one message. We will help you take the first step.'
  };
  var ID_TO_EN = EN;
  var EN_TO_ID = {};
  Object.keys(EN).forEach(function (k) { EN_TO_ID[EN[k]] = k; });

  function walk(root, map) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n; var nodes = [];
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) continue;
      nodes.push(n);
    }
    nodes.forEach(function (node) {
      var t = node.nodeValue.trim();
      if (map[t] !== undefined) node.nodeValue = node.nodeValue.replace(t, map[t]);
    });
  }

  function apply(lang) {
    var map = lang === 'en' ? ID_TO_EN : EN_TO_ID;
    if (lang === 'en' && !document.documentElement.hasAttribute('data-id-ready')) {
      document.documentElement.setAttribute('data-id-ready', '1');
    }
    walk(document.querySelector('.top'), map);
    walk(document.querySelector('.site-footer'), map);
    if (document.documentElement.getAttribute('data-page') === 'home') walk(document.querySelector('main'), map);
    document.documentElement.lang = lang === 'en' ? 'en' : 'id';
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function current() { try { return localStorage.getItem(KEY) || 'id'; } catch (e) { return 'id'; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  function build() {
    var row = document.querySelector('.top .nav-cta');
    if (!row || row.querySelector('.lang')) return;
    var box = document.createElement('div');
    box.className = 'lang';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Pilih bahasa / Choose language');
    box.innerHTML = '<button type="button" data-lang-btn="id" aria-pressed="true">ID</button><span aria-hidden="true">|</span><button type="button" data-lang-btn="en" aria-pressed="false">EN</button>';
    row.insertBefore(box, row.firstChild);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang-btn]'); if (!b) return;
      var l = b.getAttribute('data-lang-btn'); save(l); apply(l);
    });
  }

  function init() {
    build();
    var l = current();
    if (l === 'en') apply('en'); else apply('id');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
