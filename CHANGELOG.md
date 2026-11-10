# CHANGELOG — v9 → v10

## Visual
- Hero: latar navy dalam dengan kisi dan cahaya radial, judul lebih besar (tracking rapat), foto dalam bingkai membulat, badge teks melingkar berputar.
- Label editorial bernomor (01/02/03) pada beranda, penomoran daftar layanan.
- Halaman dalam: cahaya latar bergerak dan garis pemisah yang menggambar diri.
- Footer gelap dengan wordmark raksasa, tombol "Kembali ke atas"; CTA menyatu dengan footer.
- Header: garis bawah animasi pada menu, ikon menu menjadi X, menu mobile muncul berjenjang.

## Motion (GSAP 3.13.0 + ScrollTrigger, file lokal)
- Pemuatan singkat (sekali per sesi, hanya beranda): logo + hitung 0–100%.
- Transisi halaman: tirai naik saat pindah halaman, terangkat saat tiba (aman untuk tombol Kembali/bfcache).
- Hero: judul muncul per kata, teks/tombol berjenjang, foto terbuka dengan topeng + zoom-out, parallax halus.
- Scroll: judul section per kata, konten berjenjang (batch), gambar topeng terbuka, parallax gambar, kata paragraf profil menyala mengikuti scroll, angka statistik naik, ticker mengikuti kecepatan/arah scroll, header sembunyi saat turun.
- Interaksi: tombol magnetik (hanya perangkat mouse), cahaya hero mengikuti kursor, zoom hover pada kartu/video, garis bawah animasi pada tautan.
- Tidak memakai Lenis (scroll native sudah halus; menghindari konflik).
- Pin ScrollTrigger tidak dipakai: struktur halaman tidak membutuhkannya.

## Aksesibilitas & performa
- `prefers-reduced-motion`: semua gerak, tirai, dan keadaan awal tersembunyi dinonaktifkan.
- Failsafe: bila GSAP gagal, konten langsung tampil (diuji).
- Gerak hanya `transform`/`opacity` (plus variabel CSS untuk topeng gambar); umpan balik tombol/tautan 200ms.
- Fokus terlihat 2px, `aria-hidden` pada elemen dekoratif, tombol ikon ber-aria-label.
- Atribut width/height pada semua gambar; CLS terukur ~0,004 pada beranda.

## Teknis & SEO
- `canonical` pada beranda dipindah ke `<head>` (sebelumnya di `<body>`).
- Ditambah og:url, og:image (`assets/og-image.jpg` 1200×630), twitter:card, og:locale; 404 diberi noindex dan font.
- Baru: `vercel.json`, `robots.txt`, `sitemap.xml`, `package.json`, `scripts/check.mjs`, `assets/vendor/*`.
- CSS lama untuk reveal/`.line` dihapus (diganti GSAP); `main.js` diperbaiki (selector header) dan ditambah tombol ke atas.
- Tidak ada halaman, teks, tautan, form WhatsApp, atau video yang dihapus.

## Pengujian (Chromium headless, lokal)
Lolos: 8 halaman × 3 lebar (1440/820/390) tanpa error JS, tanpa overflow horizontal, tanpa elemen tertinggal tersembunyi; 0 tautan/aset rusak; filter portofolio, transisi halaman, tombol Kembali, reduced-motion, dan skenario GSAP gagal.
Belum diuji: Safari/Firefox nyata, perangkat sentuh fisik, Lighthouse, dan build di Vercel sungguhan (Google Fonts tidak terjangkau dari sandbox).
