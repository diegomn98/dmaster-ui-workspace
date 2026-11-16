#!/usr/bin/env node
/**
 * Codemod: rewrite deprecated root imports of @dmaster/ui into per-component
 * entry-point imports (0.12+).
 *
 *   import { provideDmasterUI, DmButtonComponent, DialogRef } from '@dmaster/ui';
 * becomes
 *   import { provideDmasterUI } from '@dmaster/ui/core';
 *   import { DmButtonComponent } from '@dmaster/ui/button';
 *   import { DialogRef } from '@dmaster/ui/dialog';
 *
 * Run it from YOUR project's root, after installing @dmaster/ui 0.12 or later:
 *
 *   node migrate-to-entry-points.mjs            # rewrites ./src
 *   node migrate-to-entry-points.mjs src e2e    # or the folders you list
 *   node migrate-to-entry-points.mjs --dry-run  # only report what would change
 *
 * It needs no install of its own: it reads the entry points and their exports
 * from node_modules/@dmaster/ui (exports map + .d.ts) with the project's own
 * `typescript` package, and parses your files with the TypeScript AST, so
 * multi-line imports, `import type`, per-name `type` modifiers, aliases
 * (`X as Y`) and `export { … } from '@dmaster/ui'` re-exports are handled.
 * A statement with a name no entry point exports is left untouched and
 * reported (exit code 1) — nothing is ever dropped. Namespace (`* as`) and
 * side-effect imports of the root can't be split automatically and are
 * reported for a manual fix. Comments INSIDE the braces of a rewritten import
 * are not kept. Re-running it is a no-op. Run your formatter afterwards if a
 * generated line exceeds your print width.
 *
 * Source: https://github.com/diegomn98/dmaster-ui-workspace/blob/main/scripts/migrate-to-entry-points.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve } from 'node:path';

const ROOT = '@dmaster/ui';
const cwd = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) targets.push('src');

const fail = (msg) => {
  console.error(`✖ ${msg}`);
  process.exit(1);
};

// ---------------------------------------------------------------- 1. tooling
const requireFromProject = createRequire(join(cwd, 'package.json'));
let ts;
try {
  ts = requireFromProject('typescript');
} catch {
  fail("Could not load 'typescript' from this project. Run the codemod from your project root.");
}
const pkgDir = join(cwd, 'node_modules', '@dmaster', 'ui');
if (!existsSync(join(pkgDir, 'package.json'))) {
  fail(`${ROOT} is not installed in ./node_modules. Install @dmaster/ui 0.12 or later first.`);
}
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));

// --------------------------------------------- 2. symbol -> entry point map
const entryTypes = {}; // entry name -> absolute .d.ts path
for (const [key, value] of Object.entries(pkg.exports ?? {})) {
  if (key === '.' || typeof value !== 'object' || !value.types) continue;
  entryTypes[key.slice(2)] = join(pkgDir, value.types);
}
if (!Object.keys(entryTypes).length) {
  fail(`${ROOT}@${pkg.version} has no per-component entry points — upgrade to 0.12 or later.`);
}
const program = ts.createProgram(Object.values(entryTypes), {
  noEmit: true,
  skipLibCheck: true,
  types: [],
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
});
const checker = program.getTypeChecker();
const owners = new Map(); // exported name -> [entry, …] (sorted)
for (const [entry, file] of Object.entries(entryTypes)) {
  const source = program.getSourceFile(file);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;
  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    if (!owners.has(symbol.name)) owners.set(symbol.name, []);
    owners.get(symbol.name).push(entry);
  }
}
for (const list of owners.values()) list.sort();

// ------------------------------------------------------------ 3. rewriting
const problems = [];
const warnings = [];

/** Pick the entry for each specifier: a name exported by several entry points
 *  (e.g. DIALOG_DATA from dialog AND drawer) goes to an entry the same
 *  statement already uses, else to the first one alphabetically. */
function groupSpecifiers(specs) {
  const decided = new Set(
    specs
      .map((s) => owners.get(s.name))
      .filter((o) => o?.length === 1)
      .map((o) => o[0]),
  );
  const groups = [];
  for (const s of specs) {
    const candidates = owners.get(s.name);
    const entry = candidates.find((c) => decided.has(c)) ?? candidates[0];
    let group = groups.find((g) => g.entry === entry);
    if (!group) groups.push((group = { entry, specs: [] }));
    group.specs.push(s);
  }
  return groups;
}

function rewriteFile(file) {
  const text = readFileSync(file, 'utf8');
  if (!text.includes(ROOT)) return 0;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const rel = relative(cwd, file);
  const edits = [];

  for (const stmt of sf.statements) {
    const isImport = ts.isImportDeclaration(stmt);
    const isExport = ts.isExportDeclaration(stmt);
    if (!isImport && !isExport) continue;
    if (!stmt.moduleSpecifier || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
    if (stmt.moduleSpecifier.text !== ROOT) continue;
    const { line } = sf.getLineAndCharacterOfPosition(stmt.getStart(sf));
    const where = `${rel}:${line + 1}`;

    let elements;
    let statementIsTypeOnly;
    if (isImport) {
      const clause = stmt.importClause;
      const bindings = clause?.namedBindings;
      if (!clause || clause.name || !bindings || !ts.isNamedImports(bindings)) {
        warnings.push(
          `${where}: ${clause ? 'namespace/default' : 'side-effect'} import of '${ROOT}' — split it by hand`,
        );
        continue;
      }
      elements = bindings.elements;
      statementIsTypeOnly = clause.isTypeOnly;
    } else {
      if (!stmt.exportClause || !ts.isNamedExports(stmt.exportClause)) {
        warnings.push(
          `${where}: 'export * from '${ROOT}'' — re-export the entry points you need by hand`,
        );
        continue;
      }
      elements = stmt.exportClause.elements;
      statementIsTypeOnly = stmt.isTypeOnly;
    }

    const specs = elements.map((el) => {
      const name = (el.propertyName ?? el.name).text;
      const alias = el.propertyName ? ` as ${el.name.text}` : '';
      return { name, text: `${el.isTypeOnly ? 'type ' : ''}${name}${alias}` };
    });
    const unknown = specs.filter((s) => !owners.has(s.name)).map((s) => s.name);
    if (unknown.length) {
      problems.push(
        `${where}: not exported by any ${ROOT} entry point: ${unknown.join(', ')} — statement left untouched`,
      );
      continue;
    }

    const keyword = isImport ? 'import' : 'export';
    const typeOnly = statementIsTypeOnly ? ' type' : '';
    const replacement = groupSpecifiers(specs)
      .map(
        (g) =>
          `${keyword}${typeOnly} { ${g.specs.map((s) => s.text).join(', ')} } from '${ROOT}/${g.entry}';`,
      )
      .join(eol);
    edits.push({ start: stmt.getStart(sf), end: stmt.getEnd(), replacement });
  }

  if (!edits.length) return 0;
  let out = text;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end);
  }
  if (!dryRun) writeFileSync(file, out);
  console.log(
    `${dryRun ? '~' : '✔'} ${rel} (${edits.length} statement${edits.length > 1 ? 's' : ''})`,
  );
  return edits.length;
}

// ---------------------------------------------------------------- 4. run
const SKIP = new Set(['node_modules', 'dist', '.angular', 'out-tsc', '.git', 'coverage']);
const walk = (p) => {
  const stats = statSync(p);
  if (stats.isFile()) return /\.(m|c)?tsx?$/.test(p) && !p.endsWith('.d.ts') ? [p] : [];
  return readdirSync(p).flatMap((f) => (SKIP.has(f) ? [] : walk(join(p, f))));
};
let statements = 0;
let files = 0;
for (const target of targets) {
  const abs = resolve(cwd, target);
  if (!existsSync(abs)) fail(`Path not found: ${target}`);
  for (const file of walk(abs)) {
    const n = rewriteFile(file);
    if (n) {
      statements += n;
      files++;
    }
  }
}

console.log(
  `\n${dryRun ? 'Would rewrite' : 'Rewrote'} ${statements} root import${statements === 1 ? '' : 's'} in ${files} file${files === 1 ? '' : 's'}` +
    ` (${ROOT}@${pkg.version}, ${Object.keys(entryTypes).length} entry points).`,
);
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const p of problems) console.error(`✖ ${p}`);
if (problems.length) process.exitCode = 1;
