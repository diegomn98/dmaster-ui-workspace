/**
 * Size audit for @dmaster/ui — measures the real tree-shaken cost of each
 * public component, the way a consumer app pays for it.
 *
 * Pipeline (mirrors what the Angular CLI does with published libraries):
 *   1. Run the Angular linker over the built FESM (partial compilation
 *      output is NOT tree-shakeable until linked).
 *   2. Apply the CLI's babel optimizations (adjust-static-class-members,
 *      elide-angular-metadata, pure-toplevel-functions) so static `ɵcmp`
 *      initializers are annotated as pure.
 *   3. Bundle a one-import entry per component with esbuild (minified,
 *      @angular/* + rxjs external) and gzip the result.
 *
 * Skipping steps 1–2 makes every component appear to cost the whole library —
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
import { join, resolve, sep, dirname } from 'node:path';
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

const FESM = join(root, 'dist/dmaster-ui/fesm2022/dmaster-ui.mjs');
const FESM_ICONS = join(root, 'dist/dmaster-ui/fesm2022/dmaster-ui-icons.mjs');
const CSS = join(root, 'dist/dmaster-ui/styles/dmaster-ui.css');

// One entry per user-facing import (composites grouped the way a consumer
// would actually import them).
const ENTRIES = {
  skeleton: ['DmSkeletonComponent'],
  spinner: ['DmSpinnerComponent'],
  badge: ['DmBadgeComponent'],
  avatar: ['DmAvatarComponent'],
  kbd: ['DmKbdComponent'],
  icon: ['DmIconComponent'],
  card: ['DmCardComponent'],
  accordion: ['DmAccordionComponent', 'DmAccordionItemComponent'],
  divider: ['DmDividerComponent'],
  progress: ['DmProgressComponent'],
  alert: ['DmAlertComponent'],
  button: ['DmButtonComponent'],
  switch: ['DmSwitchComponent'],
  checkbox: ['DmCheckboxComponent'],
  'radio-group': ['DmRadioGroupComponent', 'DmRadioComponent'],
  select: ['DmSelectComponent'],
  autocomplete: ['DmAutocompleteComponent'],
  'paginated-select': ['DmPaginatedSelectComponent'],
  'search-field': ['DmSearchFieldComponent'],
  'date-picker': ['DmDatePickerComponent'],
  'color-picker': ['DmColorPickerComponent'],
  slider: ['DmSliderComponent'],
  error: ['DmErrorComponent'],
  'form-field': ['DmFormFieldComponent', 'DmInputDirective'],
  breadcrumbs: ['DmBreadcrumbsComponent', 'DmBreadcrumbItemComponent'],
  tabs: ['DmTabsComponent', 'DmTabComponent', 'DmTabPanelComponent'],
  pagination: ['DmPaginationComponent'],
  table: ['DmTableComponent'],
  tooltip: ['DmTooltipDirective'],
  dialog: ['DmDialogService'],
  toast: ['DmToastService'],
  menu: ['DmMenuComponent', 'DmMenuItemComponent', 'DmMenuTriggerDirective'],
  popover: ['DmPopoverComponent', 'DmPopoverTriggerDirective'],
  drawer: ['DmDrawerService'],
  command: ['DmCommandComponent'],
};

const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(1).padStart(6) + ' kB';

function linkFesm(fesmPath, outDir, outName) {
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
  const outPath = join(outDir, outName);
  writeFileSync(outPath, out.code);
  return outPath.split(sep).join('/');
}

async function bundleSize(resolveDir, source) {
  const result = await esbuild.build({
    stdin: { contents: source, resolveDir, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
    external: ['@angular/*', 'rxjs', 'rxjs/*', 'tslib'],
  });
  const out = result.outputFiles[0].contents;
  return { min: out.length, gzip: gz(Buffer.from(out)) };
}

const tmp = mkdtempSync(join(tmpdir(), 'dmui-size-'));
try {
  writeFileSync(join(tmp, 'package.json'), JSON.stringify({ type: 'module', sideEffects: false }));
  const linked = linkFesm(FESM, tmp, 'linked.mjs');
  const linkedIcons = linkFesm(FESM_ICONS, tmp, 'linked-icons.mjs');

  const rows = [];
  for (const [name, exportsList] of Object.entries(ENTRIES)) {
    const source = `export { ${exportsList.join(', ')} } from ${JSON.stringify(linked)};`;
    const { min, gzip } = await bundleSize(tmp, source);
    rows.push({ name, min, gzip });
  }
  rows.sort((a, b) => b.gzip - a.gzip);

  const full = await bundleSize(tmp, `export * from ${JSON.stringify(linked)};`);
  const icons = await bundleSize(tmp, `export * from ${JSON.stringify(linkedIcons)};`);
  const cssBuf = readFileSync(CSS);
  const fesmRaw = statSync(FESM).size;

  if (process.argv.includes('--json')) {
    console.log(
      JSON.stringify(
        { components: rows, full, icons, css: { raw: cssBuf.length, gzip: gz(cssBuf) }, fesmRaw },
        null,
        2,
      ),
    );
  } else {
    console.log('\nPer-component tree-shaken cost (linked + minified; @angular/rxjs external)\n');
    console.log('  component            minified      gzip');
    console.log('  ' + '-'.repeat(44));
    for (const r of rows) {
      console.log(`  ${r.name.padEnd(18)} ${kb(r.min)}  ${kb(r.gzip)}`);
    }
    console.log('  ' + '-'.repeat(44));
    console.log(`  ${'FULL LIBRARY'.padEnd(18)} ${kb(full.min)}  ${kb(full.gzip)}`);
    console.log(`  ${'icons entry'.padEnd(18)} ${kb(icons.min)}  ${kb(icons.gzip)}`);
    console.log(`  ${'global CSS'.padEnd(18)} ${kb(cssBuf.length)}  ${kb(gz(cssBuf))}`);
    console.log(`\n  FESM raw on disk: ${kb(fesmRaw)} (pre-link, whole library)\n`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
