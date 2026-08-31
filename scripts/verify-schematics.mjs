/**
 * Runs the built @dmaster/ui schematics against an in-memory workspace and
 * asserts they generate + wire what they promise. The schematics have no other
 * automated coverage (verify:package configures the starter by hand, never via
 * `ng add`), so this is their safety net — and it guards the shared utils.ts
 * that both `ng-add` and `theme` now depend on.
 *
 * Needs the compiled collection: run `npm run build:schematics` (or `build`)
 * first. Wired as `npm run verify:schematics`.
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const collection = join(workspaceRoot, 'dist', 'dmaster-ui', 'schematics', 'collection.json');

if (!existsSync(collection)) {
  console.error(
    `[verify-schematics] Missing ${collection}. Run "npm run build:schematics" (or "npm run build") first.`,
  );
  process.exit(1);
}

const { HostTree } = await import('@angular-devkit/schematics');

/** A minimal Angular workspace: one application with a base styles array. */
function baseTree() {
  const tree = new HostTree();
  tree.create('/package.json', JSON.stringify({ name: 'demo', version: '0.0.0' }, null, 2));
  tree.create(
    '/angular.json',
    JSON.stringify(
      {
        version: 1,
        projects: {
          demo: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: {
                  styles: ['node_modules/@dmaster/ui/styles/dmaster-ui.css'],
                },
              },
            },
          },
        },
      },
      null,
      2,
    ),
  );
  return tree;
}

function stylesOf(tree) {
  const ws = JSON.parse(tree.readContent('/angular.json'));
  return ws.projects.demo.architect.build.options.styles;
}

const runner = new SchematicTestRunner('@dmaster/ui', collection);
let passed = 0;

async function test(label, fn) {
  await fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

console.log('verify-schematics: running the built @dmaster/ui schematics\n');

// ── theme: global recolor ────────────────────────────────────────────────────
await test('theme (global) scaffolds :root + dark and wires angular.json', async () => {
  const tree = await runner.runSchematic('theme', { name: 'Brand', primary: '#Ff0000' }, baseTree());
  const css = tree.readContent('/src/brand.theme.css');
  assert.match(css, /:root \{/, 'expected a :root block');
  assert.match(css, /\[data-dm-theme='dark'\] \{/, 'expected a dark block');
  assert.match(css, /--dm-primary: #ff0000;/, 'primary should be normalized to lowercase');
  assert.ok(!css.includes("data-dm-theme='brand'"), 'global mode must not emit a named block');
  assert.ok(
    stylesOf(tree).includes('src/brand.theme.css'),
    'the theme css should be added to angular.json styles',
  );
  // Last in the array so it overrides the base tokens.
  const styles = stylesOf(tree);
  assert.equal(styles[styles.length - 1], 'src/brand.theme.css', 'theme css must load last');
});

// ── theme: named (switchable) ────────────────────────────────────────────────
await test('theme (--named) scaffolds a data-dm-theme block with color-scheme', async () => {
  const tree = await runner.runSchematic(
    'theme',
    { name: 'midnight', named: true, scheme: 'dark', primary: '#123456' },
    baseTree(),
  );
  const css = tree.readContent('/src/midnight.theme.css');
  assert.match(css, /\[data-dm-theme='midnight'\] \{/, 'expected a named block');
  assert.match(css, /color-scheme: dark;/, 'named block should set color-scheme');
  assert.match(css, /--dm-primary: #123456;/);
  assert.ok(!css.includes(':root {'), 'named mode must not emit a :root recolor');
  assert.ok(stylesOf(tree).includes('src/midnight.theme.css'));
});

// ── theme: short hex + skipImport ────────────────────────────────────────────
await test('theme expands #rgb and honours --skipImport', async () => {
  const tree = await runner.runSchematic(
    'theme',
    { name: 'lime', primary: '#0f0', skipImport: true },
    baseTree(),
  );
  assert.match(tree.readContent('/src/lime.theme.css'), /--dm-primary: #00ff00;/, 'short hex expands');
  assert.ok(
    !stylesOf(tree).includes('src/lime.theme.css'),
    'skipImport must not touch angular.json',
  );
});

// ── ng-add: prebuilt theme wiring (exercises the shared utils) ───────────────
await test('ng-add wires the chosen prebuilt theme css last', async () => {
  const tree = await runner.runSchematic('ng-add', { theme: 'ocean' }, baseTree());
  const styles = stylesOf(tree);
  assert.ok(
    styles.includes('node_modules/@dmaster/ui/themes/ocean.css'),
    'ocean theme css should be wired',
  );
  assert.ok(
    styles.includes('node_modules/@angular/cdk/overlay-prebuilt.css'),
    'cdk overlay css should be first',
  );
  assert.equal(styles[0], 'node_modules/@angular/cdk/overlay-prebuilt.css', 'cdk css must be first');
  assert.equal(
    styles[styles.length - 1],
    'node_modules/@dmaster/ui/themes/ocean.css',
    'theme css must be last',
  );
});

console.log(`\n✓ ${passed} schematic checks passed.`);
