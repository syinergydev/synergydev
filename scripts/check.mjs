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
console.log(pages.length + ' halaman diperiksa, ' + bad + ' tautan/aset rusak.');
process.exit(bad ? 1 : 0);
