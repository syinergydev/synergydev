// Pemeriksa tautan & aset lokal. Jalankan: npm run check
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const skip = new Set(['node_modules', '.git', 'scripts']);
const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    if (skip.has(f)) continue;
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(root);

let bad = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const re = /\b(?:src|href|poster)="([^"#?]+)(?:[?#][^"]*)?"/g;
  let m;
  while ((m = re.exec(html))) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(u)) continue;
    let target = u.startsWith('/') ? join(root, u) : resolve(dirname(page), u);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) { console.log('RUSAK  ' + relative(root, page) + ' -> ' + u); bad++; }
  }
}

// --- v13: pemeriksaan tambahan ---
let warn = 0;
const rel = (p) => relative(root, p).replace(/\\/g, '/');
const konsepHtml = readFileSync(join(root, 'konsep/index.html'), 'utf8');
const nKonsep = (konsepHtml.match(/class="kon-item"/g) || []).length;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const r = rel(page);
  const isEn = r === 'en/index.html' || r.startsWith('en/');
  const lang = (html.match(/<html[^>]*\blang="([^"]+)"/) || [])[1];
  if (r.startsWith('google')) continue;
  if (lang !== (isEn ? 'en' : 'id') && r !== '404.html') { console.log('LANG   ' + r + ' lang=' + lang); warn++; }
  if (r !== '404.html' && !/rel="canonical"/.test(html)) { console.log('CANON  ' + r); warn++; }
  if (r !== '404.html' && !/hreflang="en"/.test(html)) { console.log('HREFLANG ' + r); warn++; }
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (!t || t.length > 70) { console.log('TITLE  ' + r + ' (' + t.length + ')'); warn++; }
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\bwidth=/.test(img) || !/\bheight=/.test(img)) { console.log('IMGDIM ' + r + ' ' + img.slice(0, 80)); warn++; }
    if (!/\balt=/.test(img)) { console.log('IMGALT ' + r + ' ' + img.slice(0, 80)); warn++; }
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { console.log('JSONLD ' + r + ' tidak valid'); warn++; }
  }
  const c = (html.match(/data-konsep-count>(\d+)</) || [])[1];
  if (c && Number(c) !== nKonsep) { console.log('KONSEP ' + r + ' menyebut ' + c + ', halaman konsep punya ' + nKonsep); warn++; }
}
console.log(pages.length + ' halaman diperiksa, ' + bad + ' tautan/aset rusak, ' + warn + ' peringatan (jumlah konsep aktual: ' + nKonsep + ').');
process.exit(bad || warn ? 1 : 0);
