import { expect, test } from '@playwright/test';

const caseStudies = [
  {
    slug: 'throughline',
    title: 'Throughline',
    metric: 'Offline-first',
  },
  {
    slug: 'lorebound',
    title: 'Lorebound',
    metric: 'Story packs',
  },
  {
    slug: 'moto-track',
    title: 'Moto Track',
    metric: 'Docker-ready',
  },
  {
    slug: 'hefesto',
    title: 'Hefesto',
    metric: '0.456',
  },
] as const;

for (const caseStudy of caseStudies) {
  test(`${caseStudy.title} case study renders`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/projects/${caseStudy.slug}`);

    await expect(page.locator('h1')).toContainText(caseStudy.title);
    const decisionLog = page.getByLabel('Decision log');
    await expect(decisionLog.getByText('Problem', { exact: true })).toBeVisible();
    await expect(decisionLog.getByText('Constraint', { exact: true })).toBeVisible();
    await expect(decisionLog.getByText('Decision', { exact: true })).toBeVisible();
    await expect(decisionLog.getByText('Outcome', { exact: true })).toBeVisible();
    await expect(page.getByText(caseStudy.metric, { exact: true })).toBeVisible();

    const projectNav = page.locator('[data-nav-section="projects"]').first();
    await expect(projectNav).toHaveAttribute('data-active', 'true', { timeout: 5_000 });

    const scene = page.locator('[data-testid="site-scene"]');
    await expect(scene).toHaveAttribute('data-scene-section', 'projects', { timeout: 15_000 });
  });
}

test('Portuguese case studies use localized decision logs and preserve the project when switching language', async ({ page }) => {
  await page.goto('/pt/projects/lorebound/');

  await expect(page.locator('h1')).toContainText('Lorebound');
  await expect(page.locator('main article > header').getByText('Em desenvolvimento', { exact: true })).toBeVisible();
  await expect(page.getByText('Problema', { exact: true })).toBeVisible();
  await expect(page.getByText('Restrição', { exact: true })).toBeVisible();
  await expect(page.getByText('Decisão', { exact: true })).toBeVisible();
  await expect(page.getByText('Resultado', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Switch to English' })).toHaveAttribute('href', '/projects/lorebound/');
  await expect(page.getByRole('link', { name: /repositório/i })).toHaveCount(0);
});

test('case studies include dynamic OpenGraph image and BreadcrumbList JSON-LD schema', async ({ page, request }) => {
  await page.goto('/projects/lorebound/');

  const ogImageMeta = page.locator('meta[property="og:image"]');
  await expect(ogImageMeta).toHaveAttribute('content', /https?:\/\/[^/]+\/open-graph\/projects\/lorebound\.png/);

  const twitterImageMeta = page.locator('meta[name="twitter:image"]');
  await expect(twitterImageMeta).toHaveAttribute('content', /https?:\/\/[^/]+\/open-graph\/projects\/lorebound\.png/);

  // Verify that the generated OG image endpoint returns 200 and image/png
  const ogImageUrl = await ogImageMeta.getAttribute('content');
  expect(ogImageUrl).toBeTruthy();
  if (ogImageUrl) {
    const url = new URL(ogImageUrl);
    const res = await request.get(url.pathname);
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
  expect(breadcrumb.itemListElement[1].name).toBe('Projects');
  expect(breadcrumb.itemListElement[2].name).toBe('Lorebound');
});

