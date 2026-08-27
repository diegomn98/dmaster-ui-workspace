/**
 * Regenera el social preview (og:image / GitHub social card) a partir de
 * docs/social-preview.html, renderizándolo con el Chromium de Playwright a
 * 1280×640 @1.5x (1920×960 px reales — nítido pero ligero para el unfurl).
 *
 *   node scripts/social-preview.mjs
 *
 * Escribe docs/social-preview.png y lo copia a
 * projects/ngx-test-app/public/social-preview.png (lo que sirve dmasterui.com
 * como og:image). Si cambias las dimensiones, actualiza también los meta
 * og:image:width/height de projects/ngx-test-app/src/index.html.
 */
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const source = resolve(root, 'docs/social-preview.html');
const outDocs = resolve(root, 'docs/social-preview.png');
const outPublic = resolve(root, 'projects/ngx-test-app/public/social-preview.png');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 640 },
    deviceScaleFactor: 1.5,
  });
  await page.goto(pathToFileURL(source).href);
  // Espera a que Inter (Google Fonts) esté cargada — sin esto el titular
  // se rasteriza con la fuente de fallback.
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outDocs });
  copyFileSync(outDocs, outPublic);
  console.log(`social-preview: written ${outDocs} and copied to public/ (1920×960 @1.5x)`);
} finally {
  await browser.close();
}
