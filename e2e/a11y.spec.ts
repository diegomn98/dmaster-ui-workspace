import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import type { Result } from 'axe-core';

import { prerenderedRoutes } from './routes';

/** WCAG 2.1 Level A + AA — the bar the README commits to. */
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/** Both themes ship: an AA claim untested in dark is only half a claim. */
const THEMES = ['light', 'dark'] as const;

/** Turn axe violations into a readable failure message. */
function report(violations: Result[]): string {
  if (violations.length === 0) return '';
  return violations
    .map((v) => {
      const where = v.nodes.map((n) => `      ${n.target.join(' ')}`).join('\n');
      return `  [${v.impact}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n${where}`;
    })
    .join('\n\n');
}

/** Stamp the theme the way ThemeService would, then let it paint. */
async function applyTheme(page: Page, theme: (typeof THEMES)[number]): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => document.documentElement.setAttribute('data-dm-theme', t), theme);
  await page.waitForTimeout(60);
}

async function scan(page: Page): Promise<Result[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  return violations;
}

test.describe('accessibility (axe-core, WCAG AA)', () => {
  for (const theme of THEMES) {
    for (const route of prerenderedRoutes()) {
      test(`no violations [${theme}]: ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' });
        await applyTheme(page, theme);
        const violations = await scan(page);
        expect(violations, `\n${report(violations)}\n`).toEqual([]);
      });
    }
  }
});

/**
 * Overlays render their content on demand into a CDK overlay container, so the
 * per-route scan above never sees them. Open the representative overlays and
 * scan again — this is where focus traps, listbox roles and `aria-modal` live.
 */
test.describe('accessibility: opened overlays', () => {
  async function openAndScan(page: Page, opened: Locator) {
    await expect(opened).toBeVisible();
    const violations = await scan(page);
    expect(violations, `\n${report(violations)}\n`).toEqual([]);
  }

  test('select listbox', async ({ page }) => {
    await page.goto('/components/select', { waitUntil: 'networkidle' });
    await page.locator('[role="combobox"]').first().click();
    await openAndScan(page, page.locator('[role="listbox"]'));
  });

  test('menu panel', async ({ page }) => {
    await page.goto('/components/menu', { waitUntil: 'networkidle' });
    // Scope to <main>: the docs header now hosts a hidden mobile language menu
    // (also aria-haspopup="menu"), so target the demo trigger, not the chrome.
    await page.locator('main [aria-haspopup="menu"]').first().click();
    await openAndScan(page, page.locator('[role="menu"]'));
  });

  test('dialog', async ({ page }) => {
    await page.goto('/components/dialog', { waitUntil: 'networkidle' });
    await page
      .getByRole('button', { name: /open|dialog/i })
      .first()
      .click();
    await openAndScan(page, page.locator('[role="dialog"], .cdk-dialog-container'));
  });
});
