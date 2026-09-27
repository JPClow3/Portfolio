import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('languagePreference', 'en'));
  // Keep the third-party Turnstile widget from holding the network open
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile = { reset() {} };' }),
  );
});

async function scrollToY(page: Page, y: number) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior }), y);
}

test.describe('header behaviour', () => {
  test('hides while scrolling down and returns on scroll up', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('#header');

    await scrollToY(page, 400);
    await scrollToY(page, 1400);
    await expect(header).toHaveAttribute('data-hidden', 'true');
    await expect(header).toHaveClass(/scrolled/);

    await scrollToY(page, 1100);
    await expect(header).toHaveAttribute('data-hidden', 'false');
  });

  test('keyboard focus always reveals the header', async ({ page }) => {
    await page.goto('/');
    await scrollToY(page, 400);
    await scrollToY(page, 1600);
    await expect(page.locator('#header')).toHaveAttribute('data-hidden', 'true');

    await page.locator('#header a').first().focus();
    await expect(page.locator('#header')).toHaveAttribute('data-hidden', 'false');
  });

  test('sliding nav indicator follows the hovered link', async ({ page }) => {
    await page.goto('/services/');
    const indicator = page.locator('[data-nav-indicator]');
    await expect(indicator).toHaveAttribute('data-visible', 'true');

    const link = page.locator('.nav-link--track[data-nav-section="about"]');
    await link.hover();
    const box = await link.boundingBox();
    await expect.poll(async () => (await indicator.boundingBox())?.x ?? 0).toBeCloseTo(box!.x, 0);
  });

  test('scroll progress is exposed for the header line and back-to-top ring', async ({ page }) => {
    await page.goto('/');
    const progress = () => page.evaluate(() => Number(getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress') || 0));

    expect(await progress()).toBeLessThan(0.01);
    await scrollToY(page, 5000);
    await expect.poll(progress).toBeGreaterThan(0.2);

    const backToTop = page.locator('#back-to-top-btn');
    await expect(backToTop).toBeVisible();
    await backToTop.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });
});

test.describe('hero', () => {
  test('stats count up to the values computed from content', async ({ page }) => {
    await page.goto('/');
    const counters = page.locator('[data-count]');
    await expect(counters).toHaveCount(2);

    for (const counter of await counters.all()) {
      const target = Number(await counter.getAttribute('data-count'));
      expect(target).toBeGreaterThan(0);
      await expect.poll(async () => Number(await counter.textContent()), { timeout: 5_000 }).toBe(target);
    }
  });

  test('reduced motion shows final values and decoded text immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const first = page.locator('[data-count]').first();
    expect(Number(await first.textContent())).toBe(Number(await first.getAttribute('data-count')));
    await expect(page.locator('[data-scramble]')).toHaveText(/Software engineering studio/);
  });

  test('eyebrow decodes to readable text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-scramble]')).toHaveText('Software engineering studio · Brazil → Worldwide', { timeout: 5_000 });
  });
});

test.describe('feedback', () => {
  test('copy email writes to the clipboard and confirms', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only in Playwright');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/contact/');

    const button = page.locator('#contact [data-copy]').first();
    await button.click();
    await expect(button).toHaveAttribute('data-copied', 'true');
    await expect(button.locator('[data-copy-status]')).toHaveText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('joao@jpclow.dev');
    await expect(button).toHaveAttribute('data-copied', 'false', { timeout: 4_000 });
  });

  test('FAQ items open and close from the keyboard', async ({ page }) => {
    await page.goto('/');
    const second = page.locator('#faq details').nth(1);
    await expect(second).not.toHaveAttribute('open', '');

    await second.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('open', '');
    await expect(second.locator('p')).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(second).not.toHaveAttribute('open', '');
  });

  test('contact form sends company and service with the inquiry', async ({ page }) => {
    let payload: Record<string, string> = {};
    await page.route('https://turnstile.example.test/**', (route) => route.fulfill({ json: { success: true } }));
    await page.route(/turnstile\.example\.test\/?$/, (route) => route.fulfill({ json: { success: true } }));
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile = { reset() {} };' }),
    );
    await page.route('https://api.web3forms.com/submit', async (route) => {
      const body = route.request().postDataBuffer()?.toString('latin1') ?? '';
      for (const match of body.matchAll(/name="([^"]+)"\r\n\r\n([^\r]*)/g)) payload[match[1]] = match[2];
      await route.fulfill({ json: { success: true } });
    });

    await page.goto('/contact/');
    test.skip((await page.locator('#contact-form').count()) === 0, 'form disabled without access key');

    await page.locator('#name').fill('Ana Client');
    await page.locator('#email').fill('ana@company.com');
    await page.locator('#company').fill('Acme Agro');
    await page.locator('#service').selectOption({ label: 'Workflow automation' });
    await page.locator('#message').fill('We need to automate our harvest reporting pipeline.');
    await page.locator('#contact-form').evaluate((form) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'cf-turnstile-response';
      input.value = 'token';
      form.append(input);
    });
    await page.locator('#submit-btn').click();

    await expect(page.locator('#success-message')).toBeVisible();
    expect(payload.company).toBe('Acme Agro');
    expect(payload.service).toBe('Workflow automation');
    expect(payload.subject).toContain('project inquiry');
    await expect(page.locator('#submit-btn')).toHaveAttribute('data-loading', 'false');
  });

  test('invalid fields are flagged and announced', async ({ page }) => {
    await page.goto('/contact/');
    test.skip((await page.locator('#contact-form').count()) === 0, 'form disabled without access key');

    await page.locator('#email').fill('not-an-email');
    await page.locator('#email').blur();
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#email-error')).toHaveText(/valid email/i);

    await page.locator('#email').fill('ok@company.com');
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'false');
  });
});

test.describe('navigation integrity', () => {
  test('service deep links land on the matching section', async ({ page }) => {
    await page.goto('/');
    await page.locator('#services a[href="/services/#data"]').click();
    await expect(page).toHaveURL(/\/services\/#data$/);
    await expect(page.locator('#data')).toBeInViewport();
  });

  test('every internal link on the studio pages resolves', async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of ['/', '/pt/', '/services/', '/about/', '/contact/', '/pt/services/', '/pt/about/', '/pt/contact/']) {
      await page.goto(path);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!));
      hrefs.forEach((href) => seen.add(href.split('#')[0]));
    }

    const broken: string[] = [];
    for (const href of seen) {
      if (!href) continue;
      const response = await request.get(href);
      if (response.status() >= 400) broken.push(`${href} → ${response.status()}`);
    }
    expect(broken).toEqual([]);
  });

  test('language switcher keeps the current studio page', async ({ page }) => {
    for (const path of ['/services/', '/about/', '/contact/']) {
      await page.goto(path);
      await expect(page.getByRole('link', { name: 'Mudar para Português' }).first()).toHaveAttribute('href', `/pt${path}`);
    }
  });

  test('mobile menu offers the primary CTA and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const button = page.locator('#mobile-menu-button');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu a[href="/contact/"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });
});

test.describe('layout & runtime health', () => {
  for (const path of ['/', '/services/', '/about/', '/contact/', '/pt/']) {
    test(`${path} has no horizontal overflow on phones and no runtime errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error' && !/turnstile|challenges\.cloudflare|web3forms|gravatar/i.test(message.text())) {
          errors.push(message.text());
        }
      });

      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test('studio pages ship complete, unique SEO metadata', async ({ page }) => {
    const titles = new Set<string>();
    for (const path of ['/', '/services/', '/about/', '/contact/', '/pt/', '/pt/services/', '/pt/about/', '/pt/contact/']) {
      await page.goto(path);
      const title = await page.title();
      expect(title, path).toContain('JPCLOW');
      titles.add(title);

      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{80,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://jpclow.dev${path}`);
      await expect(page.locator('h1')).toHaveCount(1);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe(path.startsWith('/pt') ? 'pt' : 'en');
    }
    expect(titles.size).toBe(8);
  });

  test('organization structured data is valid JSON-LD', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = blocks.map((block) => JSON.parse(block));
    const organization = parsed.find((block) => block['@id'] === 'https://jpclow.dev/#organization');
    expect(organization?.name).toBe('JPCLOW');
    expect(parsed.some((block) => block['@type'] === 'FAQPage')).toBe(true);
  });

  test('dark theme is the default and light is opt-in', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    // Studio surfaces stay dark in light mode
    const heroBg = await page.locator('#top').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(heroBg).toBe('rgb(14, 16, 20)');
  });
});

test.describe('case studies & catalog', () => {
  test('catalog filters by status and announces the count', async ({ page }) => {
    await page.goto('/projects/');
    const items = page.locator('.catalog-item');
    const total = await items.count();
    expect(total).toBeGreaterThan(5);

    const live = page.locator('[data-catalog-filters] [data-filter="live"]');
    await live.click();
    await expect(live).toHaveAttribute('aria-pressed', 'true');
    const liveCount = Number(await live.locator('.catalog-filter-count').textContent());
    await expect(page.locator('.catalog-item:visible')).toHaveCount(liveCount);
    await expect(page.locator('[data-catalog-count]')).toHaveText(String(liveCount));
    for (const item of await page.locator('.catalog-item:visible').all()) {
      await expect(item).toHaveAttribute('data-status', 'live');
    }

    await page.locator('[data-filter="all"]').click();
    await expect(page.locator('.catalog-item:visible')).toHaveCount(total);
  });

  test('case studies link to related services and the next case study', async ({ page }) => {
    await page.goto('/projects/moto-track/');
    const related = page.getByRole('navigation', { name: 'Services behind this project' });
    await expect(related.locator('a[href="/services/#platforms"]')).toBeVisible();

    const next = page.locator('main a.panel[href^="/projects/"]').last();
    const href = await next.getAttribute('href');
    expect(href).not.toBe('/projects/moto-track/');
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });

  test('case study breadcrumb points at the catalog and ends with a CTA', async ({ page }) => {
    await page.goto('/pt/projects/moto-track/');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Projetos e cases' })).toHaveAttribute('href', '/pt/projects/');
    await expect(page.locator('main #contact a[href="/pt/contact/"]')).toBeVisible();
  });
});

test.describe('social previews & structured data', () => {
  const pages = [
    { path: '/', og: '/open-graph/site/home.png' },
    { path: '/services/', og: '/open-graph/site/services.png' },
    { path: '/about/', og: '/open-graph/site/about.png' },
    { path: '/contact/', og: '/open-graph/site/contact.png' },
    { path: '/projects/', og: '/open-graph/site/projects.png' },
    { path: '/blog/', og: '/open-graph/site/blog.png' },
    { path: '/pt/services/', og: '/open-graph/pt/site/services.png' },
  ];

  for (const entry of pages) {
    test(`${entry.path} ships its own 1200×630 social preview`, async ({ page, request }) => {
      await page.goto(entry.path);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `https://jpclow.dev${entry.og}`);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');

      const response = await request.get(entry.og);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image/png');
      const body = await response.body();
      expect(body.subarray(1, 4).toString()).toBe('PNG');
      expect(body.readUInt32BE(16)).toBe(1200);
      expect(body.readUInt32BE(20)).toBe(630);
    });
  }

  test('studio pages expose typed WebPage and BreadcrumbList schema', async ({ page }) => {
    for (const [path, type] of [['/about/', 'AboutPage'], ['/contact/', 'ContactPage'], ['/services/', 'WebPage'], ['/projects/', 'CollectionPage']] as const) {
      await page.goto(path);
      const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((block) => JSON.parse(block));
      expect(blocks.some((block) => block['@type'] === type), `${path} ${type}`).toBe(true);
      const breadcrumb = blocks.find((block) => block['@type'] === 'BreadcrumbList');
      expect(breadcrumb?.itemListElement.at(-1).item).toBe(`https://jpclow.dev${path}`);
    }
  });

  test('sitemap lists every studio page in both locales', async ({ request }) => {
    const index = await (await request.get('/sitemap-index.xml')).text();
    const sitemapPath = new URL(index.match(/<loc>([^<]+)<\/loc>/)![1]).pathname;
    const sitemap = await (await request.get(sitemapPath)).text();
    for (const path of ['/services/', '/about/', '/contact/', '/pt/services/', '/pt/about/', '/pt/contact/']) {
      expect(sitemap, path).toContain(`<loc>https://jpclow.dev${path}</loc>`);
    }
  });

  test('404 offers studio destinations and stays out of the index', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('#error-heading')).toHaveText('Page Not Found');
    await expect(page.locator('#dest-services')).toHaveAttribute('href', '/services/');
    await expect(page.locator('#dest-contact')).toHaveAttribute('href', '/contact/');
  });
});
