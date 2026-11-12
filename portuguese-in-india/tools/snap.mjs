// Screenshot a page of this project (kit review boards): node tools/snap.mjs review/cast.png "review.html?board=cast" [w h]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [out, page = 'review.html', w = 1920, h = 1080] = process.argv.slice(2);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.otf': 'font/otf', '.ttf': 'font/ttf' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: +w, height: +h } }); const errs = [];
pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await pg.goto(`http://127.0.0.1:${srv.address().port}/${page}`); await pg.waitForFunction(() => window.REVIEW_READY || window.REVIEW_ERROR, null, { timeout: 60000 });
const err = await pg.evaluate(() => window.REVIEW_ERROR); if (err) errs.push(err);
fs.mkdirSync(path.dirname(path.resolve(ROOT, out)), { recursive: true });
await (await pg.$('#cv')).screenshot({ path: path.resolve(ROOT, out) }); await b.close(); srv.close();
console.log(out, errs.length ? 'ERRORS:\n' + errs.join('\n') : 'ok');
