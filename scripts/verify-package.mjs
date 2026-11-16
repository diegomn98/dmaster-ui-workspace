/**
 * Consumer-perspective package check.
 *
 * The monorepo's tsconfig maps `@dmaster/ui` to the library SOURCE, so building
 * the dashboard never exercises the *published package*. This script closes that
 * gap: it builds the library, packs it exactly as `npm publish` would, installs
 * that tarball into an isolated Angular app (examples/starter) that lives outside
 * the workspace, and builds it. If the package's `exports` map, type entry
 * points, peer dependencies or shipped styles don't resolve for a real consumer,
 * the build fails here — before a release, not after.
 *
 * Since 0.12 it also checks every per-component entry point from the
 * consumer's node_modules: each `@dmaster/ui/<entry>` in the packed exports map
 * must resolve to its FESM and ship its `.d.ts`, and the starter itself must
 * import by subpath only (never the deprecated root `@dmaster/ui`).
 *
 * Run with `npm run verify:package` (see package.json).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist', 'dmaster-ui');
const starter = join(root, 'examples', 'starter');

function run(cmd, cwd = root) {
  console.log(`\n$ ${cmd}\n  (cwd: ${cwd})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

/** Each JS subpath of the INSTALLED package resolves to a FESM and ships its types. */
function checkEntryPoints() {
  const installed = join(starter, 'node_modules', '@dmaster', 'ui');
  const pkg = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
  const requireFromStarter = createRequire(join(starter, 'package.json'));
  const problems = [];
  let count = 0;
  for (const [key, value] of Object.entries(pkg.exports ?? {})) {
    if (typeof value !== 'object' || !value.types) continue; // styles, themes, package.json
    const specifier = key === '.' ? '@dmaster/ui' : `@dmaster/ui/${key.slice(2)}`;
    count++;
    try {
      const resolved = requireFromStarter.resolve(specifier);
      if (!/fesm2022[\\/]dmaster-ui[\w-]*\.mjs$/.test(resolved))
        problems.push(`${specifier} → ${resolved}`);
    } catch (e) {
      problems.push(`${specifier} does not resolve (${e.code ?? e.message})`);
    }
    const types = join(installed, value.types);
    if (!existsSync(types) || statSync(types).size === 0)
      problems.push(`${specifier}: missing types ${value.types}`);
  }
  // The starter dogfoods the subpaths (it is also the StackBlitz demo and copy-paste reference).
  const walk = (dir) =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
    });
  for (const file of walk(join(starter, 'src'))) {
    if (/from\s*'@dmaster\/ui'/.test(readFileSync(file, 'utf8'))) {
      problems.push(`${file.slice(starter.length + 1)} imports the deprecated root '@dmaster/ui'`);
    }
  }
  if (problems.length) {
    throw new Error('Entry-point check failed:\n  - ' + problems.join('\n  - '));
  }
  console.log(
    `\n✓ ${count} JS entry points resolve from a consumer's node_modules, each with its .d.ts.`,
  );
}

function tarballIn(dir) {
  return readdirSync(dir).find((f) => f.startsWith('dmaster-ui-') && f.endsWith('.tgz'));
}

// Clean any leftover tarball from a previous run.
const stale = tarballIn(starter);
if (stale) rmSync(join(starter, stale));

// 1. Build the library if it isn't built yet.
if (!existsSync(join(dist, 'package.json'))) {
  run('npm run build');
}
const version = JSON.parse(readFileSync(join(dist, 'package.json'), 'utf8')).version;

// 2. Pack the built package exactly as `npm publish` would, into the starter.
run(`npm pack --pack-destination "${starter}"`, dist);
const tgz = tarballIn(starter);
if (!tgz) throw new Error('npm pack did not produce a tarball');
console.log(`\nPacked @dmaster/ui ${version} → ${tgz}`);

try {
  // 3. Install the consumer app with the freshly packed tarball in ONE step
  //    (--no-save keeps the committed package.json clean): the explicit
  //    tarball replaces the package.json range for @dmaster/ui, so this works
  //    even before the version the starter asks for is on the registry, and we
  //    test THIS build, not the last publish.
  run(`npm install "./${tgz}" --no-save --no-audit --no-fund`, starter);

  // 3b. Every entry point resolves from the consumer's node_modules.
  checkEntryPoints();

  // 4. Build the consumer app. Resolution of `@dmaster/ui/<entry>`,
  //    `@dmaster/ui/icons` and `@dmaster/ui/styles/*` all happen from a real
  //    node_modules here.
  run('npm run build', starter);

  console.log(`\n✓ @dmaster/ui ${version} builds cleanly in a fresh consumer app.`);
} finally {
  const leftover = tarballIn(starter);
  if (leftover) rmSync(join(starter, leftover));
}
