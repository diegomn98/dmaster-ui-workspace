/**
 * Renderiza la og:image de cada portada ilustrada del blog a partir de su ruta
 * prerenderizada /blog/<slug>/cover (el lienzo 1200×630 completo, con sus
 * esquinas). Guía de diseño: docs/release-covers.md.
 *
 *   npm run build:app && npm run covers
 *
 * Sirve dist/ngx-test-app/browser con un servidor estático mínimo, captura el
 * `app-release-cover` de cada ruta con el Chromium de Playwright a 1.5x
 * (1800×945 — nítido en feeds retina, como scripts/social-preview.mjs) y lo
 * guarda como JPEG q90 en projects/ngx-test-app/public/blog/covers/<slug>.jpg,
 * la og:image que declara el artículo (COVER_IMAGE en core/blog/covers.ts — si
 * cambian escala, tamaño o formato aquí, cambiarlos allí también).
 * Los JPEG se versionan: Cloudflare sirve `public/` tal cual.
 *
 * Cada JPEG se copia también a dist/ngx-test-app/browser/blog/covers/: la
 * captura sale DEL build, así que ese build se generó antes de que existieran
 * las imágenes nuevas y sus og:image darían 404 al servirlo tal cual. Con la
 * copia, el build queda completo sin volver a compilar (el próximo build:app
 * ya las toma de public/).
 *
 * Antes de capturar, comprueba la zona segura: cada elemento del motivo marcado
 * con `data-safe="<nombre>"` (la pieza protagonista, la anotación, el cursor…)
 * debe caer dentro de x 320–880, y 105–525; si no, falla y no escribe nada de
 * esa portada.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const dist = resolve(root, 'dist/ngx-test-app/browser');
const outDir = resolve(root, 'projects/ngx-test-app/public/blog/covers');
const distCoversDir = join(dist, 'blog/covers');
const SCALE = 1.5;
const QUALITY = 90;

if (!existsSync(join(dist, 'index.html'))) {
  console.error(
    'render-release-covers: no prerendered build found — run `npm run build:app` first.',
  );
  process.exit(1);
}

// Slugs con portada = los que el prerender emitió en blog/<slug>/cover/.
const blogDir = join(dist, 'blog');
const slugs = readdirSync(blogDir).filter((slug) =>
  existsSync(join(blogDir, slug, 'cover', 'index.html')),
);
if (slugs.length === 0) {
  console.error('render-release-covers: no /blog/<slug>/cover routes in the build.');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

// Cada ruta prerenderizada tiene su index.html; sin fallback SPA.
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  let file = join(dist, path);
  if (!file.startsWith(dist)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

mkdirSync(outDir, { recursive: true });
mkdirSync(distCoversDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const slug of slugs) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: SCALE,
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    });
    await page.goto(`${base}/blog/${slug}/cover`, { waitUntil: 'networkidle' });
    // Inter / JetBrains Mono llegan de Google Fonts: sin esperar, el texto se
    // rasteriza con la fuente de reserva.
    await page.evaluate(() => document.fonts.ready);
    const cover = page.locator('app-release-cover');
    const box = await cover.boundingBox();
    if (!box || Math.round(box.width) !== 1200 || Math.round(box.height) !== 630) {
      throw new Error(`/blog/${slug}/cover: expected a 1200×630 cover, got ${JSON.stringify(box)}`);
    }
    // Zona segura (docs/release-covers.md §3): todo lo marcado `data-safe` en el
    // motivo tiene que caer en x 320–880, y 105–525 del lienzo, o algún recorte
    // del blog lo cortaría. Una portada que la incumple no se publica.
    const marks = await page.evaluate(
      ({ left, top }) =>
        [...document.querySelectorAll('app-release-cover [data-safe]')].map((el) => {
          const b = el.getBoundingClientRect();
          const [x1, y1, x2, y2] = [b.left - left, b.top - top, b.right - left, b.bottom - top];
          const ok = x1 >= 319.5 && x2 <= 880.5 && y1 >= 104.5 && y2 <= 525.5;
          return ok
            ? null
            : `${el.getAttribute('data-safe')} (x ${Math.round(x1)}–${Math.round(x2)}, y ${Math.round(y1)}–${Math.round(y2)})`;
        }),
      { left: box.x, top: box.y },
    );
    const outside = marks.filter(Boolean);
    if (outside.length) {
      throw new Error(
        `/blog/${slug}/cover: outside the safe zone (x 320–880, y 105–525): ${outside.join(', ')}`,
      );
    }
    const out = join(outDir, `${slug}.jpg`);
    await cover.screenshot({ path: out, type: 'jpeg', quality: QUALITY, animations: 'disabled' });
    copyFileSync(out, join(distCoversDir, `${slug}.jpg`));
    console.log(
      `render-release-covers: ${slug} → ${out} (${1200 * SCALE}×${630 * SCALE}, ${Math.round(statSync(out).size / 1024)} kB, ${marks.length} safe-zone marks OK)`,
    );
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
