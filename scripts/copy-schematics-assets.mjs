/**
 * Copies the schematics JSON assets (collection.json, ng-add/schema.json, …) from
 * `projects/ngx-dmaster-ui/schematics/` into `dist/dmaster-ui/schematics/`, preserving the
 * folder structure. The compiled factories (`*.js`) are emitted there directly by
 * `tsc -p projects/ngx-dmaster-ui/tsconfig.schematics.json`; this script ships the JSON
 * files that tsc does not copy.
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
    const isJson = src.endsWith('.json');
    if (isJson) {
      copied += 1;
    }
    return isJson;
  },
});

console.log(`[copy-schematics-assets] Copied ${copied} JSON file(s) to ${targetDir}`);
