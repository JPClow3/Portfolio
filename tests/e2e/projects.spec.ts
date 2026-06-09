import { expect, test } from '@playwright/test';

const caseStudies = [
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
    await expect(page.getByText('Problem', { exact: true })).toBeVisible();
    await expect(page.getByText('Build', { exact: true })).toBeVisible();
    await expect(page.getByText('Result', { exact: true })).toBeVisible();
    await expect(page.getByText(caseStudy.metric, { exact: true })).toBeVisible();

    const projectNav = page.locator('[data-nav-section="projects"]').first();
    await expect(projectNav).toHaveAttribute('data-active', 'true', { timeout: 5_000 });

    const scene = page.locator('[data-testid="site-scene"]');
    await expect(scene).toHaveAttribute('data-scene-section', 'projects', { timeout: 15_000 });
  });
}
