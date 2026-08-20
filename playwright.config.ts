import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end quality gates for the docs site, which is the whole library
 * rendered in real use:
 *
 * - `a11y*.spec.ts` — axe-core (WCAG 2.1 A + AA) on every prerendered route,
 *   plus every overlay opened, so the "accessible by default" claim is proven
 *   on each PR rather than asserted.
 * - `visual*.spec.ts` — screenshot regression in light and dark, catching the
 *   CSS breakage unit tests can't see.
 *
 * Tests run against the **prerendered production build** (`npm run build:app`
 * → `dist/ngx-test-app/browser`) served statically — exactly what ships. Run
 * the build first, then `npm run e2e`.
 */
const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['list']] : [['list']],
  // Screenshots are pixel-compared; pin a deterministic engine + threshold.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Serve the prerendered static output. Each route has its own index.html,
    // so no SPA fallback is needed.
    command: `npx http-server dist/ngx-test-app/browser -p ${PORT} -c-1 --silent`,
    url: `http://localhost:${PORT}`,
    timeout: 60_000,
    reuseExistingServer: !process.env['CI'],
  },
});
