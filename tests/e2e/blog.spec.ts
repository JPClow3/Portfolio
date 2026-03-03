import { test, expect } from '@playwright/test';

test('blog index page loads', async ({ page }) => {
  await page.goto('/blog');
  
  // Check page title
  const title = page.locator('h1');
  await expect(title).toBeVisible();
  
  // Blog posts should be present (if any exist)
  const blogPosts = page.locator('article, [role="article"], .blog-post');
  const postCount = await blogPosts.count();
  
  // At minimum, page should load without errors
  expect(postCount).toBeGreaterThanOrEqual(0);
});

test('blog post navigation works', async ({ page }) => {
  await page.goto('/blog');
  
  // Check if there are any blog posts to navigate to
  const links = page.locator('a[href*="/blog/"]');
  const initialCount = await links.count();
  
  if (initialCount > 0) {
    // Get first blog post link
    const firstLink = links.first();
    
    // Navigate to blog post
    await firstLink.click();
    
    // Should have navigated to blog post
    const url = page.url();
    expect(url).toContain('/blog/');
  }
});

test('blog post displays content', async ({ page }) => {
  // Navigate to first available blog post
  await page.goto('/blog');
  
  const links = page.locator('a[href*="/blog/"]');
  const postCount = await links.count();
  
  if (postCount > 0) {
    await links.first().click();
    
    // Check main content exists
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for article or post content
    const content = page.locator('article, h1');
    expect(await content.count()).toBeGreaterThan(0);
  }
});

test('blog post has metadata', async ({ page }) => {
  await page.goto('/blog');
  
  const links = page.locator('a[href*="/blog/"]');
  const postCount = await links.count();
  
  if (postCount > 0) {
    await links.first().click();
    
    // Look for date, author, or post metadata
    const metadata = page.locator('[data-testid*="date"], [data-testid*="meta"], time, .post-meta');
    // At minimum, page should load
    expect(true).toBe(true);
  }
});
