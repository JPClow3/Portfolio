import { test, expect } from '@playwright/test';

test('homepage keeps CDN font loading and the ambient scene out of the initial critical path', async ({ page }) => {
  let threeRequestedAt: number | undefined;

  page.on('request', (request) => {
    if (request.url().includes('three.module')) {
      threeRequestedAt = Date.now();
    }
  });

  const navigationStartedAt = Date.now();
  await page.goto('/');

  const fontStylesheet = page.locator('link[href*="fonts.googleapis.com"][rel="stylesheet"]');
  await expect(fontStylesheet).toHaveAttribute('onload', /this\.media='all'/);

  await page.waitForTimeout(1_000);
  expect(threeRequestedAt).toBeUndefined();

  await expect.poll(() => threeRequestedAt, { timeout: 8_000 }).toBeDefined();
  expect(threeRequestedAt).toBeGreaterThanOrEqual(navigationStartedAt + 2_500);
});

test('homepage requests the avatar at its rendered size without a larger DPR variant', async ({ page }) => {
  await page.goto('/');

  const avatar = page.locator('.profile-avatar');
  await expect(avatar).toHaveAttribute('src', /[?&]s=212(?:&|$)/);
  await expect(avatar).not.toHaveAttribute('srcset', /./);
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
