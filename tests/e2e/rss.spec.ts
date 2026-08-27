import { test, expect } from '@playwright/test';

test('global RSS feed is accessible and returns valid XML', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'] || '';
  expect(contentType.includes('xml')).toBe(true);

  const xml = await response.text();
  expect(xml).toContain('<rss version="2.0"');
  expect(xml).toContain('<title>João Paulo Santos — Blog</title>');
  expect(xml).toContain('<item>');
});

test('Portuguese localized RSS feed is accessible and returns valid XML', async ({ request }) => {
  const response = await request.get('/pt/rss.xml');
  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'] || '';
  expect(contentType.includes('xml')).toBe(true);

  const xml = await response.text();
  expect(xml).toContain('<rss version="2.0"');
  expect(xml).toContain('<title>João Paulo Santos — Blog (Português)</title>');
  expect(xml).toContain('<language>pt-BR</language>');
});

test('pages contain RSS discovery link tags in head', async ({ page }) => {
  await page.goto('/blog/');

  const rssLink = page.locator('link[type="application/rss+xml"]').first();
  await expect(rssLink).toBeAttached();
  await expect(rssLink).toHaveAttribute('href', /rss\.xml/);
});

test('blog index includes visible RSS subscribe link', async ({ page }) => {
  await page.goto('/blog/');

  const rssBadge = page.locator('a[aria-label="RSS Feed"], a[title="RSS Feed"]');
  await expect(rssBadge).toBeVisible();
  await expect(rssBadge).toHaveAttribute('href', '/rss.xml');
});
