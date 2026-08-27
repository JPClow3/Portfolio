import { test, expect } from '@playwright/test';

test('English blog index page loads with reading time', async ({ page }) => {
  await page.goto('/blog/');
  
  // Check page title
  const title = page.locator('h1');
  await expect(title).toBeVisible();
  await expect(title).toHaveText('Latest Posts');
  
  // Blog posts should be present
  const blogPosts = page.locator('article');
  const postCount = await blogPosts.count();
  expect(postCount).toBeGreaterThan(0);

  // Reading time should be rendered on article cards
  const readingTime = page.locator('article').first().getByText(/min read/i);
  await expect(readingTime).toBeVisible();
});

test('Portuguese blog index page loads with reading time', async ({ page }) => {
  await page.goto('/pt/blog/');
  
  // Check page title
  const title = page.locator('h1');
  await expect(title).toBeVisible();
  await expect(title).toHaveText('Últimos Posts');
  
  // Blog posts should be present
  const blogPosts = page.locator('article');
  const postCount = await blogPosts.count();
  expect(postCount).toBeGreaterThan(0);

  // Reading time should be rendered on article cards in Portuguese
  const readingTime = page.locator('article').first().getByText(/min de leitura/i);
  await expect(readingTime).toBeVisible();
});

test('blog post navigation and metadata works in English', async ({ page }) => {
  await page.goto('/blog/');
  
  const firstLink = page.locator('article a[href*="/blog/"]').first();
  await firstLink.click();
  
  expect(page.url()).toContain('/blog/');
  
  // Check main content
  const heading = page.locator('article h1');
  await expect(heading).toBeVisible();

  // Check reading time in header metadata
  const readingTimeMeta = page.locator('header').getByText(/min read/i);
  await expect(readingTimeMeta).toBeVisible();
});

test('blog post navigation and metadata works in Portuguese', async ({ page }) => {
  await page.goto('/pt/blog/');
  
  const firstLink = page.locator('article a[href*="/pt/blog/"]').first();
  await firstLink.click();
  
  expect(page.url()).toContain('/pt/blog/');
  
  // Check main content
  const heading = page.locator('article h1');
  await expect(heading).toBeVisible();

  // Check reading time in header metadata
  const readingTimeMeta = page.locator('header').getByText(/min de leitura/i);
  await expect(readingTimeMeta).toBeVisible();
});

test('code copy button appears on code blocks and copies code', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/blog/hello-world/');
  
  const preBlock = page.locator('pre').first();
  await expect(preBlock).toBeVisible();
  
  const copyBtn = preBlock.locator('.copy-code-button');
  await expect(copyBtn).toBeVisible();
  await expect(copyBtn).toHaveText(/Copy/i);
  
  await copyBtn.click();
  await expect(copyBtn).toHaveText(/Copied!/i);
  await expect(copyBtn).toHaveClass(/copied/);
});

test('404 page dynamically localizes for Portuguese preference', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('languagePreference', 'pt');
  });

  await page.goto('/404');
  
  const heading = page.locator('#error-heading');
  await expect(heading).toHaveText('Página Não Encontrada');
  
  const homeBtn = page.locator('#btn-home');
  await expect(homeBtn).toHaveText('Voltar ao Início');
  await expect(homeBtn).toHaveAttribute('href', '/pt/');
});

test('blog post includes dynamic OpenGraph image and BreadcrumbList JSON-LD schema', async ({ page, request }) => {
  await page.goto('/blog/hello-world/');

  const ogImageMeta = page.locator('meta[property="og:image"]');
  await expect(ogImageMeta).toHaveAttribute('content', /https?:\/\/[^/]+\/open-graph\/blog\/hello-world\.png/);

  const twitterImageMeta = page.locator('meta[name="twitter:image"]');
  await expect(twitterImageMeta).toHaveAttribute('content', /https?:\/\/[^/]+\/open-graph\/blog\/hello-world\.png/);

  // Verify that the generated OG image endpoint returns 200 and image/png
  const ogImageUrl = await ogImageMeta.getAttribute('content');
  expect(ogImageUrl).toBeTruthy();
  if (ogImageUrl) {
    const path = new URL(ogImageUrl).pathname;
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  }

  // Verify BreadcrumbList schema in page
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const breadcrumb = scripts
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .find((s) => s && s['@type'] === 'BreadcrumbList');

  expect(breadcrumb).toBeDefined();
  expect(breadcrumb.itemListElement).toHaveLength(3);
  expect(breadcrumb.itemListElement[0].name).toBe('Home');
  expect(breadcrumb.itemListElement[1].name).toBe('Blog');
  expect(breadcrumb.itemListElement[2].name).toBe('Hello World - Welcome to My Blog');
});

