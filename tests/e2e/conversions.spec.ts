import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('languagePreference','en'));
  await page.route('https://challenges.cloudflare.com/**', route => route.fulfill({contentType:'application/javascript',body:'window.turnstile={reset(){}};'}));
  await page.route('**/api/events', route => route.fulfill({status:204}));
});

for (const lang of ['en','pt']) {
  const prefix = lang === 'pt' ? '/pt' : '';
  test(`${lang}: engineering clears the active navigation between services and process`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(prefix + '/');
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(0, 0);

    const activeLinks = page.locator('[data-nav-link][data-active="true"]');
    const indicator = page.locator('[data-nav-indicator]');
    for (const id of ['services', 'engineering', 'process', 'engineering', 'services']) {
      // Put the header's section-selection anchor well inside each section.
      await page.locator(`#${id}`).evaluate(section => {
        const rect = section.getBoundingClientRect();
        window.scrollTo({ top: scrollY + rect.top + rect.height / 2 - innerHeight * 0.38, behavior: 'instant' });
      });
      if (id === 'engineering') {
        await expect(activeLinks).toHaveCount(0);
        await expect(page.locator('[data-nav-link][aria-current]')).toHaveCount(0);
        await expect(indicator).toHaveAttribute('data-visible', 'false');
      } else {
        await expect(activeLinks).toHaveCount(2);
        await expect(page.locator(`[data-nav-track] [data-nav-section="${id}"]`)).toHaveAttribute('aria-current', 'location');
        await expect(indicator).toHaveAttribute('data-visible', 'true');
      }
    }
  });
  test(`${lang}: work leads the homepage and preserves all six selected projects`, async ({page}) => {
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(prefix+'/');
    expect(await page.locator('main > section').evaluateAll(nodes=>nodes.map(n=>n.id))).toEqual(['top','work','services','engineering','process','faq','contact']);
    await expect(page.locator('.work-stack-item')).toHaveCount(6);
    await expect(page.locator('#engineering .code-window')).toBeVisible();
    await expect(page.locator('#process img')).toHaveAttribute('alt',/João/);
    for (const card of await page.locator('.work-card').all()) {
      await expect(card.locator('[data-testid="project-capabilities"]')).toBeVisible();
      await expect(card.locator('[data-testid="project-outcome"]')).not.toBeEmpty();
    }
  });
  test(`${lang}: engagement links preselect a model; changing language preserves selections`, async ({page}) => {
    const inquiryClicks: unknown[] = [];
    await page.route('**/api/events', async route => {
      const event = route.request().postDataJSON();
      if (event.event === 'inquiry_click') inquiryClicks.push(event);
      await route.fulfill({ status: 204 });
    });
    await page.goto(prefix+'/services/#engagement');
    await page.locator(`#engagement a[href="${prefix}/contact/?engagement=consulting"]`).click();
    await expect(page.locator('#engagement')).toHaveValue('consulting');
    await expect(page.locator('[data-engagement-options]')).toHaveAttribute('open','');
    await page.locator('#service').selectOption({index:2});
    const other = page.locator(`[data-lang-link][data-lang-base="${lang==='pt'?'/':'/pt/'}"]`).first();
    await other.click();
    await expect(page.locator('#engagement')).toHaveValue('consulting');
    await expect(page.locator('#service option:checked')).toHaveAttribute('data-service-id','apis');
    await page.waitForLoadState('networkidle');
    // Language changes retain the inquiry but are not new inquiry clicks.
    expect(inquiryClicks).toHaveLength(1);
  });
  test(`${lang}: project reference enters the inquiry payload and is removable`, async ({page}) => {
    let payload: Record<string, unknown> = {};
    await page.route('**/api/contact',async route=>{payload=route.request().postDataJSON();await route.fulfill({json:{success:true}});});
    await page.goto(prefix+'/projects/agrohub/');
    await page.locator(`#contact a[href="${prefix}/contact/?project=agrohub"]`).click();
    await expect(page.locator('[data-project-title]')).toHaveText('AgroHub UniRV');
    await page.locator('#name').fill('Test Client');
    await page.locator('#email').fill('test@example.test');
    await page.locator('#message').fill('This is a mocked inquiry with enough detail.');
    await page.locator('#contact-form').evaluate(form=>{const i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';i.value='token';form.append(i);});
    await page.locator('#submit-btn').click();
    await expect(page.locator('#success-message')).toBeVisible();
    expect(payload.project).toBe('agrohub');
    await expect(page.locator('[name="project_reference"]')).toHaveValue('AgroHub UniRV');
    await page.locator('[data-remove-context]').click();
    await expect(page.locator('[name="project_reference"]')).toHaveValue('');
    await expect(page.locator('#inquiry-context')).toBeHidden();
    expect(new URL(page.url()).searchParams.has('project')).toBe(false);
  });
}

test('project cards stack on scroll, with static mobile layout and reduced-motion support', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const items = page.locator('.work-stack-item');
  const first = items.first();
  const second = items.nth(1);
  const stickyTop = await first.evaluate(element => parseFloat(getComputedStyle(element).top));
  const target = await second.evaluate(element => element.getBoundingClientRect().top + scrollY - 450);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), target);
  await expect.poll(async () => Math.abs((await first.boundingBox())!.y - stickyTop)).toBeLessThan(2);
  const before = (await second.boundingBox())!.y;
  await page.evaluate(() => window.scrollBy({ top: 120, behavior: 'instant' }));
  await expect.poll(async () => (await second.boundingBox())!.y).toBeLessThan(before - 100);
  await expect.poll(async () => Math.abs((await first.boundingBox())!.y - stickyTop)).toBeLessThan(2);
  await expect.poll(() => first.locator('.work-card').evaluate(element => parseFloat(getComputedStyle(element).scale))).toBeLessThan(1);
  mkdirSync('test-results/design-review', { recursive: true });
  await page.screenshot({ path: 'test-results/design-review/restored-stack-desktop.png' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(first.locator('.work-card')).toHaveCSS('scale', '1');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/pt/');
  await expect(first).toHaveCSS('position', 'static');
  await first.screenshot({ path: 'test-results/design-review/restored-card-mobile.png' });
});

test('conversion events capture the funnel without form text or arbitrary query values', async ({page}) => {
  const events: Record<string,unknown>[]=[];
  await page.route('**/api/events',async route=>{events.push(route.request().postDataJSON());await route.fulfill({status:204});});
  let succeed=false;
  await page.route('**/api/contact',route=>route.fulfill({json:{success:succeed}}));
  await page.goto('/projects/moto-track/?private=secret');
  await expect.poll(()=>events.some(e=>e.event==='case_study_view'&&e.project==='moto-track')).toBe(true);
  await page.locator('#contact a[href="/contact/?project=moto-track"]').click();
  await page.locator('#name').fill('Private Name');
  await page.locator('#email').fill('private@example.test');
  await page.locator('#message').fill('Private business details, never analytics.');
  await page.locator('#contact-form').evaluate(form=>{const i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';i.value='token';form.append(i);});
  await page.locator('#submit-btn').click();
  await expect(page.locator('#error-message')).toBeVisible();
  expect(events.filter(e=>e.event==='form_success')).toHaveLength(0);
  succeed=true;
  await page.locator('#submit-btn').click();
  await expect(page.locator('#success-message')).toBeVisible();
  await expect.poll(()=>events.filter(e=>e.event==='form_success').length).toBe(1);
  expect(events.filter(e=>e.event==='form_start')).toHaveLength(1);
  expect(events.some(e=>e.event==='inquiry_click'&&e.placement==='contact'&&e.project==='moto-track')).toBe(true);
  expect(JSON.stringify(events)).not.toMatch(/Private|private|secret|example.test/);
  for (const e of events) expect(Object.keys(e).sort()).toEqual(['engagement','event','locale','page','placement','project','service'].sort());
});

for (const privacy of ['doNotTrack','globalPrivacyControl']) {
  test(`analytics respects ${privacy}`, async ({page}) => {
    let sent=0;
    await page.addInitScript(key=>Object.defineProperty(navigator,key,{get:()=>key==='doNotTrack'?'1':true}),privacy);
    await page.route('**/api/events',route=>{sent++;return route.fulfill({status:204});});
    await page.goto('/');
    await page.locator('#top a[href="/contact/"]').click();
    await page.locator('#name').fill('Test');
    await expect(page.locator('#name')).toHaveValue('Test');
    expect(sent).toBe(0);
  });
}

test('rejects unknown inquiry context and keeps contact usable when analytics fails', async ({page}) => {
  await page.route('**/api/events',route=>route.abort());
  await page.goto('/contact/?project=private-name&service=private-email&engagement=<script>');
  await expect(page.locator('#inquiry-context')).toBeHidden();
  await expect(page.locator('#service')).toHaveValue('');
  await expect(page.locator('#engagement')).toHaveValue('');
  await page.locator('#name').fill('Client');
  await expect(page.locator('#name')).toHaveValue('Client');
});

test('review captures: EN/PT, desktop/mobile, dark/light', async ({page}) => {
  test.setTimeout(120_000);
  mkdirSync('test-results/design-review',{recursive:true});
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const lang of ['en','pt']) for (const width of [1440,390]) for (const theme of ['dark','light']) {
    await page.setViewportSize({width,height:900});
    await page.addInitScript(value=>localStorage.setItem('theme',value),theme);
    await page.goto(lang==='pt'?'/pt/':'/');
    for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
    await page.evaluate(()=>window.scrollTo(0,0));
    await expect.poll(()=>page.locator('#work img').first().evaluate((img)=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/design-review/${lang}-${width}-${theme}.png`,fullPage:true});
  }
});
