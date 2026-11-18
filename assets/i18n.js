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
    'Mulai dari satu pesan. Kami bantu menentukan langkah pertama.': 'Start with one message. We will help you take the first step.',
    /* Hero (judul dipecah per node oleh <br> dan <em>) */
    'Website yang membuat': 'A website that makes', 'bisnis Anda': 'your business', 'dipercaya': 'trusted',
    'sejak kunjungan pertama.': 'from the very first visit.',
    /* Pilihan proyek */
    'Proyek terpilih': 'Selected projects', 'Pilihan proyek': 'Selected work',
    'Website yang sudah dipublikasikan dan dibangun dari kebutuhan nyata.': 'Websites that are live and built from real needs.',
    'Website pendidikan · Proyek selesai': 'Education website · Completed project',
    'Hospitality · Proyek selesai': 'Hospitality · Completed project',
    'Website pusat pelatihan bahasa Inggris untuk memperkenalkan program, promo, dan informasi pendaftaran secara lebih terstruktur.':
      'An English training center website that presents programs, promotions, and registration information in a clearer structure.',
    'Informasi villa, fasilitas, galeri, dan jalur reservasi dalam satu tempat.': 'Villa information, facilities, gallery, and booking in one place.',
    'Dashboard untuk memantau omzet, pesanan, dan aktivitas harian.': 'A dashboard to track revenue, orders, and daily activity.',
    'Kunjungi website': 'Visit website', 'Buka situs ↗': 'Open site ↗', 'Lihat detail proyek': 'View project details',
    'Delapan konsep demo': 'Eight demo concepts',
    'untuk percetakan, barbershop, travel, dan kuliner sudah tersedia.': 'for printing, barbershops, travel, and food are available.',
    'Lihat konsep demo': 'View demo concepts',
    /* Layanan */
    'Apa yang kami kerjakan': 'What we do',
    'Dari company profile sampai multi-outlet, disesuaikan dengan tujuan bisnis Anda.': 'From company profiles to multi-outlet sites, tailored to your business goals.',
    'Memperkenalkan bisnis, layanan, dan kontak dengan jelas.': 'Introduces your business, services, and contact clearly.',
    'Satu halaman fokus untuk promosi, campaign, atau event.': 'A focused single page for promotions, campaigns, or events.',
    'Satu website untuk banyak cabang, lengkap dengan lokasi masing-masing.': 'One website for many branches, each with its own location.',
    'Dashboard dan sistem sederhana yang dirancang dari kebutuhan Anda.': 'Dashboards and simple systems designed around your needs.',
    'Lihat semua layanan': 'View all services',
    'Katalog produk': 'Product catalog',
    /* Tentang studio */
    'Tentang studio': 'About the studio', 'Studio kecil, perhatian penuh.': 'Small studio, full attention.',
    'SynergyDev aktif sejak 2025. Kami bekerja dengan tim kecil, memahami kebutuhan dulu, lalu membangun website yang rapi dan siap dikembangkan.':
      'SynergyDev has been active since 2025. We work with a small team, understand your needs first, then build a clean website that is ready to grow.',
    'Mulai aktif': 'Active since', 'Website dipublikasikan': 'Websites published', 'DP awal pengerjaan': 'Initial deposit'
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
      var l = b.getAttribute('data-lang-btn'); save(l); window.location.reload();
    });
  }

  function init() {
    build();
    var l = current();
    if (l === 'en') apply('en'); else apply('id');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
