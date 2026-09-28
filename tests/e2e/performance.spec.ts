import { test, expect } from '@playwright/test';

test('homepage uses self-hosted fonts without external Google Fonts and keeps the ambient scene out of the initial critical path', async ({ page, context }) => {
  let sceneRequestedAt: number | undefined;
  let loadedAt: number | undefined;
  const externalFontRequests: string[] = [];

  page.on('load', () => {
    loadedAt ??= Date.now();
  });
  // The scene renders in a worker that bundles Three.js; worker requests surface on the context
  context.on('request', (request) => {
    const url = request.url();
    if (/\/_astro\/worker-[^/]+\.js$/.test(url) || url.includes('three.module')) {
      sceneRequestedAt ??= Date.now();
    }
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
      externalFontRequests.push(url);
    }
  });

  await page.goto('/');

  const googleFontLinks = page.locator('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]');
  await expect(googleFontLinks).toHaveCount(0);
  expect(externalFontRequests).toHaveLength(0);

  // Off the main thread, so it may start right away, but only once the page has loaded
  await expect.poll(() => sceneRequestedAt, { timeout: 8_000 }).toBeDefined();
  expect(sceneRequestedAt).toBeGreaterThanOrEqual(loadedAt ?? Number.POSITIVE_INFINITY);
});

test('ambient scene starts without Three.js deprecation warnings', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning') warnings.push(message.text());
  });

  await page.goto('/');
  await page.waitForTimeout(4_000);

  expect(warnings).not.toContain('THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.');
});
