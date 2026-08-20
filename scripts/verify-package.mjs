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
 * Run with `npm run verify:package` (see package.json).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist', 'dmaster-ui');
const starter = join(root, 'examples', 'starter');

function run(cmd, cwd = root) {
  console.log(`\n$ ${cmd}\n  (cwd: ${cwd})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
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
  // 3. Install the consumer app (pulls Angular + the published @dmaster/ui),
  //    then force the freshly packed tarball on top (--no-save keeps the
  //    committed package.json clean) so we test THIS build, not the last publish.
  run('npm install --no-audit --no-fund', starter);
  run(`npm install "./${tgz}" --no-save --no-audit --no-fund`, starter);

  // 4. Build the consumer app. Resolution of `@dmaster/ui`, `@dmaster/ui/icons`
  //    and `@dmaster/ui/styles/*` all happen from a real node_modules here.
  run('npm run build', starter);

  console.log(`\n✓ @dmaster/ui ${version} builds cleanly in a fresh consumer app.`);
} finally {
  const leftover = tarballIn(starter);
  if (leftover) rmSync(join(starter, leftover));
}
