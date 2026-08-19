import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist/ngx-test-app/browser';

/**
 * Every prerendered route, derived from the per-route `index.html` files the
 * static build emits — so the a11y and visual suites cover exactly what ships,
 * and a new page is picked up automatically once it's prerendered.
 */
export function prerenderedRoutes(): string[] {
  const routes: string[] = [];

  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry === 'index.html') {
        const rel = relative(DIST, dir).split(sep).join('/');
        routes.push(rel === '' ? '/' : `/${rel}`);
      }
    }
  };

  walk(DIST);
  return routes.sort();
}
