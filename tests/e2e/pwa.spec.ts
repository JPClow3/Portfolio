import { test, expect } from '@playwright/test';

test('homepage includes Web App Manifest link and theme color', async ({ page }) => {
  await page.goto('/');

  const manifest = page.locator('link[rel="manifest"]');
  await expect(manifest).toHaveAttribute('href', '/site.webmanifest');

  const themeColor = page.locator('meta[name="theme-color"]').first();
  await expect(themeColor).toBeAttached();
});

test('web manifest is accessible and contains valid JSON metadata', async ({ request }) => {
  const response = await request.get('/site.webmanifest');
  expect(response.status()).toBe(200);

  const manifest = await response.json();
  expect(manifest.name).toContain('João Paulo');
  expect(manifest.start_url).toBe('/');
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.length).toBeGreaterThan(0);
});

test('service worker file is accessible and valid script', async ({ request }) => {
  const response = await request.get('/sw.js');
  expect(response.status()).toBe(200);

  const script = await response.text();
  expect(script).toContain('CACHE_NAME');
  expect(script).toContain('addEventListener');
});

test('offline fallback page is accessible and displays informative status', async ({ page }) => {
  await page.goto('/offline.html');

  await expect(page.locator('h1')).toContainText(/Offline/i);
  await expect(page.getByRole('button', { name: /Recarregar|Try Again/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Início|Home/i })).toBeVisible();
});
