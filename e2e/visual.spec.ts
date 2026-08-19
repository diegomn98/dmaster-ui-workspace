import { expect, test, type Page } from '@playwright/test';

import { prerenderedRoutes } from './routes';

/**
 * Visual-regression: screenshot every prerendered route in both themes and
 * pixel-diff against committed baselines. Catches the CSS breakage unit tests
 * can't see — a token gone wrong, a layout that collapses, a dark-mode surface
 * that vanishes.
 *
 * Baselines are environment-specific (fonts, anti-aliasing), so they're both
 * generated AND compared inside the official Playwright container — never on a
 * developer's host. See README → "Visual regression".
 */
const THEMES = ['light', 'dark'] as const;

async function prepare(page: Page, route: string, theme: (typeof THEMES)[number]): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(route, { waitUntil: 'networkidle' });
  await page.evaluate((t) => document.documentElement.setAttribute('data-dm-theme', t), theme);
  // Let icon fonts settle and the reveal-on-scroll classes resolve before snapping.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

test.describe('visual regression', () => {
  for (const theme of THEMES) {
    for (const route of prerenderedRoutes()) {
      test(`${theme}: ${route}`, async ({ page }) => {
        await prepare(page, route, theme);
        const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
        await expect(page).toHaveScreenshot(`${slug}-${theme}.png`, { fullPage: true });
      });
    }
  }
});
