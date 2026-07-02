import { test, expect } from '@playwright/test';
import { inflateSync } from 'node:zlib';

function paethPredictor(left: number, up: number, upLeft: number) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);

  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  if (upDistance <= upLeftDistance) return up;

  return upLeft;
}

function pngHasNonBlankPixels(buffer: Buffer) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 6;
  const idatChunks: Buffer[] = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === 'IHDR') {
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      colorType = buffer[dataStart + 9];
    } else if (type === 'IDAT') {
      idatChunks.push(buffer.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }

    offset = dataEnd + 4;
  }

  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  let readOffset = 0;
  let previous = new Uint8Array(stride);
  let visiblePixels = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[readOffset];
    readOffset += 1;
    const current = new Uint8Array(stride);

    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[readOffset + x];
      const left = x >= bytesPerPixel ? current[x - bytesPerPixel] : 0;
      const up = previous[x] ?? 0;
      const upLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] : 0;

      if (filter === 1) current[x] = (raw + left) & 255;
      else if (filter === 2) current[x] = (raw + up) & 255;
      else if (filter === 3) current[x] = (raw + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) current[x] = (raw + paethPredictor(left, up, upLeft)) & 255;
      else current[x] = raw;
    }

    for (let x = 0; x < stride; x += bytesPerPixel * 18) {
      const red = current[x] ?? 0;
      const green = current[x + 1] ?? 0;
      const blue = current[x + 2] ?? 0;
      const alpha = bytesPerPixel === 4 ? current[x + 3] ?? 0 : 255;

      if (alpha > 4 && red + green + blue > 8) {
        visiblePixels += 1;
      }
    }

    if (visiblePixels > 12) return true;
    readOffset += stride;
    previous = current;
  }

  return false;
}

test('homepage loads and displays main sections', async ({ page }) => {
  await page.goto('/');
  
  // Check page title
  await expect(page).toHaveTitle(/João Paulo/i);
  
  // Check main heading exists
  const mainHeading = page.locator('h1');
  await expect(mainHeading).toBeVisible();
  
  // Check navigation exists
  const nav = page.locator('header nav, [role="banner"] nav').first();
  await expect(nav).toBeVisible();
  
  // Check footer exists
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();
});

test('hero section is visible', async ({ page }) => {
  await page.goto('/');
  
  // Check hero section
  const hero = page.locator('section').first();
  await expect(hero).toBeVisible();
  
  // Check for call-to-action buttons
  const ctaButtons = page.locator('a[href*="#projects"], a[href*="github.com"]');
  const count = await ctaButtons.count();
  expect(count).toBeGreaterThan(0);
});

test('ambient Three.js scene mounts and reacts to page scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const scene = page.locator('[data-testid="site-scene"]');
  const canvas = scene.locator('canvas');
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  await expect(scene).toHaveAttribute('data-scene-ready', 'true', { timeout: 15_000 });

  await page.waitForTimeout(250);
  const hasVisiblePixels = pngHasNonBlankPixels(await canvas.screenshot());

  expect(hasVisiblePixels).toBeTruthy();

  const initialTarget = Number(await scene.getAttribute('data-scroll-target'));
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));

  await expect.poll(async () => Number(await scene.getAttribute('data-scroll-target'))).toBeGreaterThan(initialTarget + 0.02);
});

test('active navigation and ambient scene follow homepage sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const scene = page.locator('[data-testid="site-scene"]');
  await expect(scene).toHaveAttribute('data-scene-ready', 'true', { timeout: 15_000 });

  await page.locator('#projects').scrollIntoViewIfNeeded();

  const projectNav = page.locator('[data-nav-section="projects"]').first();
  await expect(projectNav).toHaveAttribute('data-active', 'true', { timeout: 5_000 });
  await expect(scene).toHaveAttribute('data-scene-section', 'projects', { timeout: 5_000 });
});

test('logo focus pulls ambient particles without breaking reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const scene = page.locator('[data-testid="site-scene"]');
  const logo = page.locator('[data-logo-signal]');

  await expect(scene).toHaveAttribute('data-scene-ready', 'true', { timeout: 15_000 });
  await logo.hover();
  await expect(scene).toHaveAttribute('data-logo-focus', 'true', { timeout: 5_000 });
  await page.mouse.move(20, 180);
  await expect(scene).toHaveAttribute('data-logo-focus', 'false', { timeout: 5_000 });

  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(scene.locator('.static-gradient')).toBeVisible({ timeout: 5_000 });
  await logo.focus();
  await page.waitForTimeout(100);
  expect(pageErrors).toEqual([]);
});

test('project card interaction keeps case study links clickable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const motoTrackCard = page.locator('[data-testid="project-card"]').filter({ hasText: 'Moto Track' }).first();
  await expect(motoTrackCard).toBeVisible();
  await motoTrackCard.hover();
  await expect(motoTrackCard).toHaveAttribute('data-pointer-active', 'true', { timeout: 5_000 });
  await motoTrackCard.locator('a[href="/projects/moto-track/"]').click();
  await expect(page).toHaveURL(/\/projects\/moto-track\/?$/);
});

test('mobile menu toggles correctly', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/');
  
  // Mobile menu button should exist
  const menuButton = page.locator('button[aria-label*="menu" i], button[aria-expanded]').first();
  
  if (await menuButton.isVisible()) {
    // Menu should be closed initially
    const menuOpen = await menuButton.getAttribute('aria-expanded');
    
    // Toggle menu
    await menuButton.click();
    
    // Check if menu state changed
    const newMenuState = await menuButton.getAttribute('aria-expanded');
    expect(newMenuState).not.toBe(menuOpen);
    
    // Close menu
    await menuButton.click();
  }
});

test('theme toggle works', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/');
  
  // Look for theme toggle button
  const themeToggle = page.locator('button[aria-label="Switch to dark mode"], button[aria-label="Switch to light mode"]').first();
  
  if (await themeToggle.isVisible()) {
    const initialClass = await page.locator('html').getAttribute('class');
    await expect(themeToggle).toBeEnabled();
    
    // Click theme button
    await themeToggle.click();
    
    await expect.poll(async () => page.locator('html').getAttribute('class')).not.toBe(initialClass);
  }
});

test('links are functional', async ({ page }) => {
  await page.goto('/');

  // Check navigation links exist
  const navLinks = page.locator('nav a[href]');
  const linkCount = await navLinks.count();
  expect(linkCount).toBeGreaterThan(0);
  
  // Check social links exist
  const socialLinks = page.locator('a[href*="github"], a[href*="linkedin"], a[href*="instagram"]');
  expect(await socialLinks.count()).toBeGreaterThan(0);
});

test('page meets accessibility standards', async ({ page }) => {
  await page.goto('/');
  
  // Check for main landmark
  const main = page.locator('main, [role="main"]');
  await expect(main).toBeVisible();
  
  // Check that page has a heading
  const headings = page.locator('h1, h2, h3, h4, h5, h6');
  expect(await headings.count()).toBeGreaterThan(0);
  
  // Check for skip link (accessibility)
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toHaveCount(1);
});

test('images load correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check for images
  const images = page.locator('img');
  const imageCount = await images.count();
  
  if (imageCount > 0) {
    // Check first image is loaded
    const firstImage = images.first();
    const isVisible = await firstImage.isVisible();
    expect(isVisible).toBeTruthy();
  }
});

test('meta tags are present', async ({ page }) => {
  await page.goto('/');
  
  // Check meta description
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', /.+/);
  
  // Check viewport meta
  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveCount(1);
  
  // Check canonical link
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute('href', /https:\/\/jpclow\.dev/);
});
