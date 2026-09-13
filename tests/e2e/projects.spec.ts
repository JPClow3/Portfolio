import { expect, test } from '@playwright/test';

const caseStudies = [
  {
    slug: 'throughline',
    title: 'Throughline',
    metric: 'Local data remains usable',
  },
  {
    slug: 'lorebound',
    title: 'Lorebound',
    metric: 'Story packs',
  },
  {
    slug: 'moto-track',
    title: 'Moto Track',
    metric: 'Live SaaS',
  },
  {
    slug: 'hefesto',
    title: 'Hefesto',
    metric: '0.4565 (v5_0)',
  },
  {
    slug: 'fatec',
    title: 'FATEC Digital Platform',
    metric: 'Registration → boleto in product',
  },
  {
    slug: 'climagro',
    title: 'ClimAgro',
    metric: 'Daily + hourly',
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

test('project catalog presents current work, private-source studies, and the archive', async ({ page }) => {
  await page.goto('/projects/');

  await expect(page.locator('h1')).toHaveText('Projects');
  const cards = page.locator('main article');
  await expect(cards).toHaveCount(18);

  const expectedOrder = [
    'Moto Track',
    'AgroHub UniRV',
    'Inova Rio Verde',
    'Lorebound',
    'ClimAgro',
    'Throughline',
  ];
  for (const [index, title] of expectedOrder.entries()) {
    await expect(cards.nth(index).locator('h2')).toHaveText(title);
  }

  await expect(cards.filter({ hasText: 'FATEC Digital Platform' }).getByText('Private source', { exact: true })).toBeVisible();
  await expect(cards.filter({ hasText: 'Hefesto' }).getByText('Research', { exact: true })).toBeVisible();
  await expect(cards.filter({ hasText: 'League AI Oracle' }).getByText('Archived', { exact: true })).toBeVisible();
  await expect(cards.filter({ hasText: 'AI Development Controller' }).getByText('Prototype', { exact: true })).toBeVisible();
});

test('Portuguese project catalog is complete and localized', async ({ page }) => {
  await page.goto('/pt/projects/');

  await expect(page.locator('h1')).toHaveText('Projetos');
  await expect(page.locator('main article')).toHaveCount(18);
  const catalog = page.locator('main');
  await expect(catalog.getByText('Código privado', { exact: true }).first()).toBeVisible();
  await expect(catalog.getByText('Pesquisa', { exact: true }).first()).toBeVisible();
  await expect(catalog.getByText('Arquivado', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Switch to English' })).toHaveAttribute('href', '/projects/');
});

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
