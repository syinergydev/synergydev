# SynergyDev Website v10 (Premium + Motion GSAP)

Situs statis (HTML, CSS, JavaScript murni). **Tidak ada build step**, tidak perlu `npm install`.
Animasi memakai GSAP 3.13.0 + ScrollTrigger yang sudah disertakan lokal di `assets/vendor/`.

## Struktur
```
index.html, 404.html
layanan/ harga/ kontak/ portofolio/ faq/ tentang-kami/   (masing-masing index.html)
assets/styles.css  main.js  motion.js  vendor/(gsap, ScrollTrigger)
vercel.json  robots.txt  sitemap.xml  package.json  scripts/check.mjs
```

## Menjalankan lokal (Windows PowerShell)
Di folder project:
```powershell
# opsi 1: Node.js terpasang
npx --yes serve@14 -l 3000 .
# opsi 2: Python terpasang
python -m http.server 3000
```
Buka http://localhost:3000. Jangan buka `index.html` langsung (double-click), karena path `/assets` dan transisi halaman butuh server.

Cek tautan/aset rusak (butuh Node.js): `node scripts/check.mjs`

## Upload ke GitHub
```powershell
git init
git add .
git commit -m "SynergyDev v10 premium"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
Untuk repo yang sudah ada: ganti isi repo dengan isi ZIP ini, lalu `git add . ; git commit -m "v10" ; git push`.

## Deploy ke Vercel
1. vercel.com → **Add New → Project** → pilih repo GitHub tersebut.
2. Framework Preset: **Other**. Build Command: kosongkan. Output Directory: kosongkan (root).
3. **Deploy**. Setiap `git push` berikutnya otomatis redeploy.

`vercel.json` sudah mengatur trailing slash, header keamanan dasar, dan cache aset.

## Catatan
- Gerak otomatis nonaktif bila perangkat memakai "kurangi gerak" (prefers-reduced-motion) atau GSAP gagal dimuat; konten tetap tampil utuh.
- Setelah mengubah `styles.css`/`main.js`/`motion.js`, naikkan angka `?v=` pada tag `<link>`/`<script>` agar cache browser ter-refresh.
- Font Plus Jakarta Sans dimuat dari Google Fonts (seperti versi sebelumnya).
