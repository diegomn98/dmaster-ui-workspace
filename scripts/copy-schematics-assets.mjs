/**
 * Copies the schematics assets (collection.json, the per-schematic schema.json
 * files, and the theme scaffolds under theme/files) from
 * `projects/ngx-dmaster-ui/schematics/` into `dist/dmaster-ui/schematics/`,
 * preserving the folder structure. The
 * compiled factories (`*.js`) are emitted there directly by
 * `tsc -p projects/ngx-dmaster-ui/tsconfig.schematics.json`; this script ships the
 * non-`.ts` files (JSON + templates) that tsc does not copy.
 *
 * Run from the workspace root (any cwd works — paths resolve from this file's location):
 *   node scripts/copy-schematics-assets.mjs
 */
import { cpSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(workspaceRoot, 'projects', 'ngx-dmaster-ui', 'schematics');
const targetDir = join(workspaceRoot, 'dist', 'dmaster-ui', 'schematics');

if (!existsSync(sourceDir)) {
  console.error(`[copy-schematics-assets] Source directory not found: ${sourceDir}`);
  console.error('[copy-schematics-assets] Nothing to copy — aborting.');
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });

let copied = 0;
cpSync(sourceDir, targetDir, {
  recursive: true,
  filter: (src) => {
    if (statSync(src).isDirectory()) {
      return true;
    }
    const keep = src.endsWith('.json') || src.endsWith('.template');
    if (keep) {
      copied += 1;
    }
    return keep;
  },
});

console.log(`[copy-schematics-assets] Copied ${copied} asset file(s) to ${targetDir}`);
