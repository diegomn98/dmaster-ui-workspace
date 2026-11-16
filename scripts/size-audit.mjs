/**
 * Size audit for @dmaster/ui — measures the real tree-shaken cost of each
 * entry point (one per component since 0.12), the way a consumer app pays for
 * it, and checks that the per-component entry points actually code-split.
 *
 * Pipeline (mirrors what the Angular CLI does with published libraries):
 *   1. Run the Angular linker over every built FESM (partial compilation
 *      output is NOT tree-shakeable until linked).
 *   2. Apply the CLI's babel optimizations (adjust-static-class-members,
 *      elide-angular-metadata, pure-toplevel-functions) so static `ɵcmp`
 *      initializers are annotated as pure.
 *   3. Bundle `export * from '@dmaster/ui/<entry>'` per entry point with
 *      esbuild (minified, @angular/* + rxjs external; cross-entry imports
 *      resolve to the other linked FESMs) and gzip the result — i.e. the most
 *      that importing anything from that entry point can cost.
 *   4. Code-splitting check: a synthetic app imports dm-button eagerly and
 *      dm-checkbox only from a lazy chunk (esbuild `splitting`, Angular
 *      bundled like in a real app), once through the subpaths and once through
 *      the deprecated root `@dmaster/ui`. Fails (exit 1) if checkbox code lands
 *      in the initial chunks — the regression the per-component entry points
 *      exist to prevent (with 0.11's single FESM it always did).
 *
 * Entry points are discovered from dist/dmaster-ui/package.json `exports`
 * (no manual list: a new component is measured automatically).
 *
 * Skipping steps 1–2 makes every component appear to cost the whole entry —
 * that is an artifact of unlinked partial-compilation output, not a real
 * tree-shaking problem.
 *
 * Requires `npm run build` first (reads from dist/dmaster-ui).
 * The babel plugins in step 2 are private @angular/build internals loaded by
 * absolute path; if an Angular update moves them, the script fails loudly with
 * a pointer here rather than producing silently-wrong numbers.
 *
 * Usage: npm run size [-- --json]
 */
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));

const { transformFileSync } = require('@babel/core');
const { createEs2015LinkerPlugin } = require('@angular/compiler-cli/linker/babel');
const { NodeJSFileSystem, ConsoleLogger, LogLevel } = require('@angular/compiler-cli');
const esbuild = require('esbuild');

// Private @angular/build babel plugins (same ones the CLI applies to Angular
// packages before bundling). Loaded by absolute path because the package's
// `exports` map doesn't expose them.
const pluginsDir = join(root, 'node_modules/@angular/build/src/tools/babel/plugins');
const loadPlugin = (name) => {
  try {
    return require(join(pluginsDir, name + '.js')).default;
  } catch (e) {
    throw new Error(
      `Could not load @angular/build babel plugin "${name}" — the internal path ` +
        `may have moved in an Angular update. See the header comment in scripts/size-audit.mjs. (${e.message})`,
    );
  }
};
const adjustStaticClassMembers = loadPlugin('adjust-static-class-members');
const elideAngularMetadata = loadPlugin('elide-angular-metadata');
const pureTopLevelFunctions = loadPlugin('pure-toplevel-functions');

const DIST = join(root, 'dist/dmaster-ui');
const CSS = join(DIST, 'styles/dmaster-ui.css');
const EXTERNAL = ['@angular/*', 'rxjs', 'rxjs/*', 'tslib'];

/** { name -> FESM path } for the primary ('.' -> 'index') and every secondary entry point. */
function discoverEntries() {
  const pkg = JSON.parse(readFileSync(join(DIST, 'package.json'), 'utf8'));
  const entries = {};
  for (const [key, value] of Object.entries(pkg.exports ?? {})) {
    const target = typeof value === 'object' ? value.default : value;
    if (typeof target !== 'string' || !target.startsWith('./fesm2022/')) continue;
    entries[key === '.' ? 'index' : key.slice(2)] = join(DIST, target);
  }
  if (!entries.index) {
    throw new Error(
      'No primary entry in dist/dmaster-ui/package.json — run "npm run build" first.',
    );
  }
  return entries;
}

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(1).padStart(6) + ' kB';

/**
 * Drop the `import … from "<external>"` statements before measuring the
 * per-entry and full-library sizes. @angular/* and rxjs are external there, so
 * esbuild keeps one import header per source module in the bundle — ~49 of
 * them for the whole library (~2.8 kB gzip). In a real app Angular is bundled
 * and those headers don't exist. (The split check bundles Angular instead.)
 */
const EXTERNAL_IMPORT =
  /import\s*(?:[\w$]+\s*,?\s*)?(?:\*\s*as\s*[\w$]+|\{[^}]*\})?\s*(?:from\s*)?"[^"]+";?/g;
const libraryCode = (contents) => {
  const text = Buffer.from(contents).toString('utf8');
  return Buffer.from(
    text.replace(EXTERNAL_IMPORT, (m) => (/"(@angular\/|rxjs|tslib)/.test(m) ? '' : m)),
  );
};

function linkFesm(fesmPath, outPath) {
  const linkerPlugin = createEs2015LinkerPlugin({
    fileSystem: new NodeJSFileSystem(),
    logger: new ConsoleLogger(LogLevel.error),
    linkerJitMode: false,
  });
  const out = transformFileSync(fesmPath, {
    plugins: [linkerPlugin, adjustStaticClassMembers, elideAngularMetadata, pureTopLevelFunctions],
    compact: false,
    configFile: false,
    babelrc: false,
  });
  writeFileSync(outPath, out.code);
}

/**
 * esbuild plugin: `@dmaster/ui` / `@dmaster/ui/<entry>` -> the linked FESM in tmp.
 *
 * `sideEffects: false` is REQUIRED here: esbuild only reads package.json's
 * `sideEffects` for paths ITS resolver finds, never for paths a plugin returns.
 * Without it every linked module counts as side-effectful, so everything the
 * root's `export *` reaches gets force-included in the initial chunk — the root
 * import looked like it couldn't code-split, while a real Angular build (which
 * resolves the package through node_modules and honours `"sideEffects": false`)
 * splits it fine. That artifact misled the first 0.12 analysis.
 */
const resolveLinked = (tmp) => ({
  name: 'dmaster-ui-linked',
  setup(build) {
    build.onResolve({ filter: /^@dmaster\/ui(\/[^/]+)?$/ }, (args) => {
      const entry = args.path === '@dmaster/ui' ? 'index' : args.path.slice('@dmaster/ui/'.length);
      return { path: join(tmp, entry + '.mjs'), sideEffects: false };
    });
  },
});

async function bundleSize(tmp, source) {
  const result = await esbuild.build({
    stdin: { contents: source, resolveDir: tmp, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
    external: EXTERNAL,
    plugins: [resolveLinked(tmp)],
  });
  const out = libraryCode(result.outputFiles[0].contents);
  return { min: out.length, gzip: gz(out) };
}

/**
 * Synthetic app: dm-button in the initial chunk, dm-checkbox only behind a
 * dynamic import. Returns how many minified bytes of @dmaster/ui code end up in
 * the initial chunks and whether checkbox code is among them.
 *
 * Angular (and rxjs) are BUNDLED here, like in a real app — NOT external. esbuild
 * assumes importing an external module has side effects, so with Angular
 * external every library module reachable through the root's `export *` would
 * be force-included in the initial chunk (each keeping its `import … from
 * "@angular/core"`), and the root import would look like it can't code-split.
 * With Angular bundled (`@angular/*` declare `"sideEffects": false`), unused
 * re-exported modules are dropped, exactly as in an Angular CLI build — checked
 * against a real app (Angular 22.2, with and without NG_BUILD_OPTIMIZE_CHUNKS).
 */
async function splitCheck(tmp, mode) {
  const dir = mkdtempSync(join(tmp, `split-${mode}-`));
  const spec = (entry) => (mode === 'root' ? '@dmaster/ui' : `@dmaster/ui/${entry}`);
  writeFileSync(
    join(dir, 'main.js'),
    `import { DmButtonComponent } from '${spec('button')}';\n` +
      `console.log(DmButtonComponent);\n` +
      `export const lazy = () => import('./lazy.js');\n`,
  );
  writeFileSync(
    join(dir, 'lazy.js'),
    `import { DmCheckboxComponent } from '${spec('checkbox')}';\nconsole.log(DmCheckboxComponent);\n`,
  );
  const result = await esbuild.build({
    entryPoints: [join(dir, 'main.js')],
    absWorkingDir: dir,
    bundle: true,
    splitting: true,
    minify: true,
    format: 'esm',
    outdir: join(dir, 'out'),
    write: false,
    metafile: true,
    logLevel: 'silent',
    nodePaths: [join(root, 'node_modules')], // resolve the bundled @angular/* and rxjs
    plugins: [resolveLinked(tmp)],
  });
  // metafile keys are relative to absWorkingDir (= dir): the linked library
  // files sit one level up, in tmp, as `../<entry>.mjs`.
  const outputs = result.metafile.outputs;
  const libraryInput = /^\.\.[\\/]([\w-]+)\.mjs$/;
  const initial = new Set();
  const visit = (key) => {
    if (initial.has(key)) return;
    initial.add(key);
    for (const imp of outputs[key].imports) {
      if (imp.kind === 'import-statement' && outputs[imp.path]) visit(imp.path);
    }
  };
  visit(Object.keys(outputs).find((key) => outputs[key].entryPoint));
  // Checkbox detection by module name AND by its selector in the emitted code —
  // the content check still catches it if the library ever ships as one module
  // again (with 0.11's single FESM there's no `checkbox.mjs` input to see).
  const code = new Map(result.outputFiles.map((o) => [resolve(o.path), o.text]));
  const CHECKBOX_SELECTOR = /selectors:\[\[["'`]dm-checkbox["'`]/;
  let libraryBytes = 0;
  let checkboxInInitial = false;
  for (const key of initial) {
    if (CHECKBOX_SELECTOR.test(code.get(resolve(dir, key)) ?? '')) checkboxInInitial = true;
    for (const [input, { bytesInOutput }] of Object.entries(outputs[key].inputs)) {
      const m = input.match(libraryInput);
      if (!m || bytesInOutput === 0) continue;
      libraryBytes += bytesInOutput;
      if (m[1] === 'checkbox') checkboxInInitial = true;
    }
  }
  return { initialChunks: initial.size, libraryBytes, checkboxInInitial };
}

const tmp = mkdtempSync(join(tmpdir(), 'dmui-size-'));
try {
  writeFileSync(join(tmp, 'package.json'), JSON.stringify({ type: 'module', sideEffects: false }));
  const entries = discoverEntries();
  for (const [name, fesm] of Object.entries(entries)) linkFesm(fesm, join(tmp, name + '.mjs'));

  const rows = [];
  for (const name of Object.keys(entries)) {
    if (name === 'index' || name === 'icons' || name === 'core') continue;
    const { min, gzip } = await bundleSize(tmp, `export * from '@dmaster/ui/${name}';`);
    rows.push({ name, min, gzip });
  }
  rows.sort((a, b) => b.gzip - a.gzip);

  const full = await bundleSize(tmp, `export * from '@dmaster/ui';`);
  const core = await bundleSize(tmp, `export * from '@dmaster/ui/core';`);
  const icons = await bundleSize(tmp, `export * from '@dmaster/ui/icons';`);
  const cssBuf = readFileSync(CSS);
  const fesmRaw = Object.values(entries).reduce((sum, p) => sum + statSync(p).size, 0);
  const split = {
    subpath: await splitCheck(tmp, 'subpath'),
    root: await splitCheck(tmp, 'root'),
  };
  // Both must code-split: the subpaths by construction, and the deprecated root
  // because its `export *` re-exports side-effect-free modules that the bundler
  // drops when unused (0.11's single FESM could not be split at all).
  const splitOk = !split.subpath.checkboxInInitial && !split.root.checkboxInInitial;

  if (process.argv.includes('--json')) {
    const css = { raw: cssBuf.length, gzip: gz(cssBuf) };
    console.log(JSON.stringify({ entries: rows, full, core, icons, css, fesmRaw, split }, null, 2));
  } else {
    console.log(
      `\nPer-entry-point tree-shaken cost — export * from '@dmaster/ui/<entry>'` +
        ` (linked + minified; @angular/rxjs external)\n`,
    );
    console.log('  entry point          minified      gzip');
    console.log('  ' + '-'.repeat(44));
    for (const r of rows) console.log(`  ${r.name.padEnd(18)} ${kb(r.min)}  ${kb(r.gzip)}`);
    console.log('  ' + '-'.repeat(44));
    console.log(`  ${'FULL LIBRARY'.padEnd(18)} ${kb(full.min)}  ${kb(full.gzip)}`);
    console.log(`  ${'core entry'.padEnd(18)} ${kb(core.min)}  ${kb(core.gzip)}`);
    console.log(`  ${'icons entry'.padEnd(18)} ${kb(icons.min)}  ${kb(icons.gzip)}`);
    console.log(`  ${'global CSS'.padEnd(18)} ${kb(cssBuf.length)}  ${kb(gz(cssBuf))}`);
    console.log(
      `\n  FESM raw on disk: ${kb(fesmRaw)} (pre-link, all ${Object.keys(entries).length} entry points)`,
    );
    console.log('\nCode-splitting — dm-button eager, dm-checkbox only in a lazy chunk:');
    for (const [mode, r] of Object.entries(split)) {
      const label =
        mode === 'root' ? "root '@dmaster/ui' (deprecated)" : "subpaths '@dmaster/ui/<entry>'";
      const verdict = r.checkboxInInitial
        ? 'checkbox IN the initial chunks'
        : 'checkbox stays lazy';
      console.log(
        `  ${r.checkboxInInitial ? '✖' : '✔'} ${label.padEnd(34)} library code at startup ${kb(r.libraryBytes)} (minified) — ${verdict}`,
      );
    }
    console.log('');
  }
  if (!splitOk) {
    console.error(
      '✖ dm-checkbox leaked into the initial chunks — the per-component entry points are not code-splitting.',
    );
    process.exitCode = 1;
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
