# SynergyDev Website

Website satu halaman (one-page) untuk SynergyDev — Web Development & Digital Solution. Tidak memerlukan build.

## Struktur

- `index.html` — seluruh halaman: Hero, Highlights, Portfolio (dengan filter), Services, Benefits, How We Work, Pricing, About, FAQ, CTA, Contact (form), Lokasi (Google Maps), Footer.
- `assets/styles.css` — seluruh gaya.
- `assets/main.js` — menu mobile, filter portfolio, animasi scroll, validasi form, dan pengiriman ke WhatsApp.
- `assets/projects/<nama>.jpg` — screenshot project (`ktrog`, `ktrog-admin`, `villa-jambu-klutuk`, `fun-english`, `chasly`, `rustic-market`, `king-barbershop`).
- `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`.

## Mengganti foto

- Screenshot King Barbershop belum ada. Simpan sebagai `assets/projects/king-barbershop.jpg`. Jika belum ada, kartu menampilkan nama project sebagai placeholder.
- Foto di bagian About (`assets/hero-bg.webp`) adalah ilustrasi, bukan foto kantor asli. Ganti dengan foto kantor Anda dengan nama file yang sama.

## Deploy ke GitHub Pages

1. Upload semua isi folder ini ke repository (termasuk `.nojekyll`).
2. Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
3. Untuk custom domain `syinergydev.work.gd`, isi kolom Custom domain dan tambahkan file `CNAME` berisi satu baris `syinergydev.work.gd`.

## Catatan

- Nomor WhatsApp, email, dan domain sudah terpasang. Jika berubah, cari dan ganti di `index.html`.
- Form tidak memiliki backend. Saat dikirim, form membuka WhatsApp dengan detail yang sudah diisi.
- Harga di bagian Pricing sesuai brief terbaru (mulai Rp1.000.000). Pastikan sesuai dengan penawaran yang dipakai di tempat lain.
