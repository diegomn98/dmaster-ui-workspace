// One-shot a11y triage: scan every prerendered route + the key overlays, then
// print a DEDUPED summary (rule → impact → unique CSS targets → sample colors).
// Not a test — a reporting tool to see the whole violation surface at once.
//   node e2e/scan-report.mjs   (needs http-server on :4173 already running)
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist/ngx-test-app/browser';
const BASE = 'http://localhost:4173';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

function routes() {
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const full = join(dir, e);
      if (statSync(full).isDirectory()) walk(full);
      else if (e === 'index.html') {
        const rel = relative(DIST, dir).split(sep).join('/');
        out.push(rel === '' ? '/' : `/${rel}`);
      }
    }
  };
  walk(DIST);
  return out.sort();
}

const agg = new Map(); // ruleId -> { impact, targets:Map<target,{routes:Set,sample}> }

function record(route, violations) {
  for (const v of violations) {
    if (!agg.has(v.id)) agg.set(v.id, { impact: v.impact, help: v.help, targets: new Map() });
    const bucket = agg.get(v.id);
    for (const n of v.nodes) {
      const key = n.target.join(' ');
      if (!bucket.targets.has(key)) bucket.targets.set(key, { routes: new Set(), sample: null });
      const t = bucket.targets.get(key);
      t.routes.add(route);
      const cc = n.any?.find((a) => a.id === 'color-contrast');
      if (cc && !t.sample)
        t.sample = `${cc.data.fgColor} on ${cc.data.bgColor} = ${cc.data.contrastRatio}`;
    }
  }
}

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

for (const theme of ['light', 'dark']) {
  await page.emulateMedia({ colorScheme: theme });
  for (const r of routes()) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    // Stamp the resolved theme the way ThemeService would, then let it paint.
    await page.evaluate((t) => document.documentElement.setAttribute('data-dm-theme', t), theme);
    await page.waitForTimeout(60);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    record(`${theme} ${r}`, violations);
  }
}

// overlays
async function overlay(path, open) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  try {
    await open();
    await page.waitForTimeout(400);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    record(`OVERLAY ${path}`, violations);
  } catch (e) {
    console.log(`  ! overlay ${path} failed to open: ${e.message.split('\n')[0]}`);
  }
}
await overlay('/components/select', () => page.locator('[role="combobox"]').first().click());
await overlay('/components/menu', () => page.locator('[aria-haspopup="menu"]').first().click());
await overlay('/components/dialog', () =>
  page
    .getByRole('button', { name: /open|dialog/i })
    .first()
    .click(),
);

await browser.close();

// report
const rules = [...agg.entries()].sort((a, b) => b[1].targets.size - a[1].targets.size);
console.log(`\n===== A11Y VIOLATION SUMMARY (${rules.length} distinct rules) =====\n`);
for (const [id, b] of rules) {
  console.log(`● ${id}  [${b.impact}]  — ${b.targets.size} distinct targets`);
  console.log(`  ${b.help}`);
  const sorted = [...b.targets.entries()].sort((a, b) => b[1].routes.size - a[1].routes.size);
  for (const [target, info] of sorted.slice(0, 40)) {
    const where = info.sample ? `  {${info.sample}}` : '';
    const oneRoute = [...info.routes][0];
    console.log(`    ${info.routes.size.toString().padStart(3)}×  [${oneRoute}] ${target}${where}`);
  }
  if (sorted.length > 25) console.log(`    … ${sorted.length - 25} more targets`);
  console.log('');
}
