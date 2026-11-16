// Guards the per-component entry-point layout of @dmaster/ui (0.12+).
//
// Every folder at the package root with an `ng-package.json` is a secondary
// entry point (`@dmaster/ui/<folder>`). This check fails fast — before
// ng-packagr starts — when the layout drifts:
//   1. the primary entry (`src/public-api.ts`) must re-export EVERY entry point
//      (except `icons`, the curated SVG set, which was always separate) and
//      nothing that doesn't exist;
//   2. no file of the library may import the primary `@dmaster/ui` — entry
//      points import each other by subpath only (the primary depends on all of
//      them, so a secondary importing it would be a cycle);
//   3. no relative import may leave its entry point's folder (ng-packagr
//      compiles each entry point on its own: cross-entry code must go through
//      `@dmaster/ui/<name>`);
//   4. an entry point with component styles must declare `styleIncludePaths`
//      (secondaries don't inherit it from the primary, and without it
//      `@use 'mixins'` doesn't resolve).
//
// Run: `node scripts/check-entry-points.mjs` (also the first step of `npm run build`).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lib = join(root, 'projects/ngx-dmaster-ui');
const NOT_REEXPORTED = new Set(['icons']);
const SKIP_DIRS = new Set(['node_modules', 'schematics', 'docs-assets', '.github']);

const toPosix = (p) => p.split('\\').join('/');
const errors = [];

const entries = readdirSync(lib)
  .filter(
    (d) => statSync(join(lib, d)).isDirectory() && existsSync(join(lib, d, 'ng-package.json')),
  )
  .sort();

// 1. The primary re-exports every entry point.
const primary = readFileSync(join(lib, 'src/public-api.ts'), 'utf8');
const reexported = new Set(
  [...primary.matchAll(/export \* from '@dmaster\/ui\/([^']+)';/g)].map((m) => m[1]),
);
for (const e of entries) {
  if (!NOT_REEXPORTED.has(e) && !reexported.has(e)) {
    errors.push(`src/public-api.ts does not re-export '@dmaster/ui/${e}'`);
  }
}
for (const e of reexported) {
  if (!entries.includes(e))
    errors.push(`src/public-api.ts re-exports unknown entry '@dmaster/ui/${e}'`);
}

// 4. Styles need styleIncludePaths.
for (const e of entries) {
  const files = readdirSync(join(lib, e));
  if (!files.some((f) => f.endsWith('.scss'))) continue;
  const cfg = JSON.parse(readFileSync(join(lib, e, 'ng-package.json'), 'utf8'));
  if (!cfg.lib?.styleIncludePaths?.length) {
    errors.push(`${e}/ng-package.json: has .scss files but no lib.styleIncludePaths`);
  }
}

// 2 + 3. Import boundaries.
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return SKIP_DIRS.has(f) ? [] : walk(p);
    return p.endsWith('.ts') ? [p] : [];
  });
const IMPORT = /(?:import|export)[^'"]*?from\s*'([^']+)'|import\(\s*'([^']+)'\s*\)/g;
for (const file of walk(lib)) {
  const rel = toPosix(relative(lib, file));
  const owner = rel.split('/')[0]; // entry folder, or `src` for the primary
  // Comments are ignored: JSDoc examples aren't imports.
  const source = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  for (const m of source.matchAll(IMPORT)) {
    const spec = m[1] ?? m[2];
    if (spec === '@dmaster/ui') {
      errors.push(`${rel}: imports the primary '@dmaster/ui' — use '@dmaster/ui/<entry>'`);
    } else if (spec.startsWith('.')) {
      const target = posix.normalize(posix.join(posix.dirname(rel), spec));
      if (target.split('/')[0] !== owner) {
        errors.push(
          `${rel}: relative import '${spec}' leaves its entry point — use '@dmaster/ui/<entry>'`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error(`✖ entry-point check failed (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`✔ ${entries.length} entry points: all re-exported, boundaries clean`);
