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
