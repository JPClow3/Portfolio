import { test, expect } from '@playwright/test';
import { inflateSync } from 'node:zlib';

test('English homepage stays accessible to a Portuguese-language browser', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/?lang=en`);
  await expect(page).toHaveURL(`${baseURL}/?lang=en`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

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

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('languagePreference', 'en');
    localStorage.removeItem('reducedMotion');
  });
});

test('homepage loads and displays main sections', async ({ page }) => {
  await page.goto('/');
  
  // Check page title
  await expect(page).toHaveTitle(/JPCLOW/);
  
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

test('homepage prioritizes the client-facing project showcase', async ({ page }) => {
  await page.goto('/');

  const expectedProjects = [
    'Moto Track',
    'AgroHub UniRV',
    'Inova Rio Verde',
    'Lorebound',
    'ClimAgro',
    'Throughline',
  ];
  const cards = page.locator('[data-testid="project-card"]');

  await expect(cards).toHaveCount(expectedProjects.length);
  for (const [index, title] of expectedProjects.entries()) {
    await expect(cards.nth(index).locator('h3')).toHaveText(title);
    await expect(cards.nth(index).locator('[data-testid="project-outcome"]')).toBeVisible();
    // A proof metric is optional: only shown when the project content defines one
    expect(await cards.nth(index).locator('[data-testid="project-proof"]').count()).toBeLessThanOrEqual(1);
    await expect(cards.nth(index).locator('[data-testid="project-capabilities"] li')).toHaveCount(2);
    await expect(cards.nth(index).getByText('Problem', { exact: true })).toHaveCount(0);
    await expect(cards.nth(index).getByText('Constraint', { exact: true })).toHaveCount(0);
    await expect(cards.nth(index).getByText('Decision', { exact: true })).toHaveCount(0);
    await expect(cards.nth(index).getByText('Outcome', { exact: true })).toHaveCount(0);
  }

  const primaryNav = page.getByRole('navigation', { name: 'Primary' });
  await expect(primaryNav.getByRole('link', { name: 'Work', exact: true }).first()).toHaveAttribute('href', '/projects/');
  await expect(primaryNav.getByRole('link', { name: 'Services', exact: true }).first()).toHaveAttribute('href', '/services/');
  await expect(primaryNav.getByRole('link', { name: /start a project/i }).first()).toHaveAttribute('href', '/contact/');
});

test('hero section is visible', async ({ page }) => {
  await page.goto('/');
  
  // Check hero section
  const hero = page.locator('section').first();
  await expect(hero).toBeVisible();
  
  // B2B calls to action: start a project and jump to the work showcase
  await expect(hero.locator('a[href="/contact/"]')).toBeVisible();
  await expect(hero.locator('a[href="#work"]')).toBeVisible();
});

test('ambient Three.js scene mounts and reacts to page scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const scene = page.locator('[data-testid="site-scene"]');
  const canvas = scene.locator('canvas');
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  await expect(scene).toHaveAttribute('data-scene-ready', 'true', { timeout: 30_000 });

  await page.waitForTimeout(250);
  const hasVisiblePixels = pngHasNonBlankPixels(await canvas.screenshot());

  expect(hasVisiblePixels).toBeTruthy();

  const initialTarget = Number(await scene.getAttribute('data-scroll-target'));
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));

  await expect.poll(async () => Number(await scene.getAttribute('data-scroll-target'))).toBeGreaterThan(initialTarget + 0.02);
});

test('project card interaction keeps case study links clickable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const throughlineCard = page.locator('[data-testid="project-card"]').filter({ hasText: 'Throughline' }).first();
  await expect(page.locator('[data-testid="project-card"]').first()).toContainText('Moto Track');
  await throughlineCard.scrollIntoViewIfNeeded();
  await expect(throughlineCard).toBeVisible();
  await throughlineCard.locator('a[href="/projects/throughline/"]').click();
  await expect(page).toHaveURL(/\/projects\/throughline\/?$/);
});

test('active navigation follows homepage sections', async ({ page }) => {
  await page.goto('/');

  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-nav-section="work"]').first()).toHaveAttribute('data-active', 'true', { timeout: 5_000 });

  await page.locator('#process').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-nav-section="process"]').first()).toHaveAttribute('data-active', 'true', { timeout: 5_000 });
});

test('hero scene renders a static frame for reduced motion without errors', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const scene = page.locator('[data-testid="site-scene"]');
  await expect(scene).toHaveAttribute('data-scene-ready', 'true', { timeout: 30_000 });
  await expect(scene.locator('canvas')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test('homepage presents the B2B offer and keeps private client source protected', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#services article')).toHaveCount(6);
  await expect(page.locator('#services').getByRole('heading', { name: 'Custom web platforms' })).toBeVisible();
  await expect(page.locator('#process li article')).toHaveCount(4);
  await expect(page.locator('#engagement li article')).toHaveCount(3);
  await expect(page.locator('#faq details')).toHaveCount(7);
  await expect(page.locator('#engineering figure pre')).toBeVisible();

  const loreboundCard = page.locator('[data-testid="project-card"]').filter({ hasText: 'Lorebound' }).first();
  await expect(loreboundCard.getByText('In development', { exact: true })).toBeVisible();
  await expect(loreboundCard.getByRole('link', { name: /view code/i })).toHaveCount(0);
  await expect(page.locator('[data-testid="project-card"]').filter({ hasText: 'FATEC Digital Platform' })).toHaveCount(0);
});

test('studio pages render in both languages with localized headings', async ({ page }) => {
  const pages = [
    { path: '/services/', heading: /From first diagram/ },
    { path: '/pt/services/', heading: /Do primeiro diagrama/ },
    { path: '/about/', heading: /engineering studio built on shipping/ },
    { path: '/pt/about/', heading: /estúdio de engenharia feito para entregar/ },
    { path: '/contact/', heading: /what you need to build/ },
    { path: '/pt/contact/', heading: /o que você precisa construir/ },
  ];

  for (const entry of pages) {
    await page.goto(entry.path);
    await expect(page.locator('h1')).toHaveText(entry.heading);
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(1);
  }

  await page.goto('/services/');
  await expect(page.locator('#data')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Mudar para Português' }).first()).toHaveAttribute('href', '/pt/services/');
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

test('homepage keeps project geometry and touch targets usable across responsive widths', async ({ page }) => {
  const viewports = [
    { width: 320, height: 780 },
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const geometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);

    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards).toHaveCount(6);
    await cards.first().scrollIntoViewIfNeeded();

    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);

      const image = card.locator('img');
      await expect(image).toHaveCount(1);
      await expect.poll(async () => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }

    if (viewport.width <= 768) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      await expect(page.locator('#back-to-top-btn')).toBeHidden();

      for (const control of await page.locator('#mobile-menu-button, .theme-swap').all()) {
        const box = await control.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }

      for (const link of await cards.first().locator('a').all()) {
        const box = await link.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    }
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
  const navLinks = page.locator('header a[href], nav a[href]');
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
