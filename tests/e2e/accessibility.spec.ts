import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/pt/',
  '/services/',
  '/pt/services/',
  '/about/',
  '/contact/',
  '/pt/contact/',
  '/projects/',
  '/projects/moto-track/',
  '/blog/',
];

for (const theme of ['dark', 'light'] as const) {
  test.describe(`axe (${theme} theme)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://challenges.cloudflare.com/**', (route) =>
        route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile = { reset() {} };' }),
      );
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((value) => {
        localStorage.setItem('languagePreference', 'en');
        localStorage.setItem('theme', value);
      }, theme);
    });

    for (const path of pages) {
      test(`${path} has no WCAG 2.1 A/AA violations`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          // Third-party Cloudflare Turnstile iframe is outside our control
          .exclude('.cf-turnstile')
          .analyze();

        const summary = results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.slice(0, 3).map((node) => node.target.join(' ')),
        }));
        expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
      });
    }
  });
}
