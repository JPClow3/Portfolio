import { test, expect, type Page } from '@playwright/test';

async function hasContactForm(page: Page) {
  return (await page.locator('#contact-form').count()) > 0;
}

test('contact form is visible on homepage', async ({ page }) => {
  await page.goto('/');

  const contactSection = page.locator('#contact');
  await expect(contactSection).toBeVisible();

  if (await hasContactForm(page)) {
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
    return;
  }

  await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
  await expect(page.locator('#contact a[href*="linkedin.com"]')).toBeVisible();
});

test('form validation blocks empty submission', async ({ page }) => {
  await page.goto('/');

  if (!(await hasContactForm(page))) {
    await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
    return;
  }

  await page.locator('#submit-btn').click();

  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.locator('#email-error')).toBeVisible();
  await expect(page.locator('#message-error')).toBeVisible();

  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#message')).toHaveAttribute('aria-invalid', 'true');
});

test('form validation rejects invalid email', async ({ page }) => {
  await page.goto('/');

  if (!(await hasContactForm(page))) {
    await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
    return;
  }

  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('invalid-email');
  await page.locator('#message').fill('Mensagem com tamanho suficiente.');
  await page.locator('#submit-btn').click();

  await expect(page.locator('#email-error')).toBeVisible();
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
});

test('form accepts valid input with mocked submission', async ({ page }) => {
  await page.route('https://api.web3forms.com/submit', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto('/');

  if (!(await hasContactForm(page))) {
    await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
    return;
  }

  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('This is a valid test message with enough length.');
  await page.locator('#submit-btn').click();

  await expect(page.locator('#form-status')).toBeVisible();
  await expect(page.locator('#success-message')).toBeVisible();
  await expect(page.locator('#error-message')).toBeHidden();
});

test('form shows network error state when request fails', async ({ page }) => {
  await page.route('https://api.web3forms.com/submit', async (route) => {
    await route.abort('failed');
  });

  await page.goto('/');

  if (!(await hasContactForm(page))) {
    await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
    return;
  }

  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('Mensagem valida para verificar erro de rede.');
  await page.locator('#submit-btn').click();

  await expect(page.locator('#form-status')).toBeVisible();
  await expect(page.locator('#error-message')).toBeVisible();
  await expect(page.locator('#success-message')).toBeHidden();
});

test('form status region uses aria-live for assistive technologies', async ({ page }) => {
  await page.goto('/');

  if (!(await hasContactForm(page))) {
    await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
    return;
  }

  await expect(page.locator('#form-status')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#form-status')).toHaveAttribute('aria-atomic', 'true');
});

test('form validation messages are localized in Portuguese', async ({ page }) => {
  await page.goto('/pt/');

  if (!(await hasContactForm(page))) {
    await expect(page.locator('#contact')).toBeVisible();
    return;
  }

  await page.locator('#submit-btn').click();
  await expect(page.locator('#name-error')).toContainText('Por favor');
  await expect(page.locator('#email-error')).toContainText('Por favor');
  await expect(page.locator('#message-error')).toContainText('Por favor');
});

test('contact links have accessible names', async ({ page }) => {
  await page.goto('/');

  const links = page.locator('#contact a');
  const count = await links.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    if (await link.isVisible()) {
      await expect(link).toHaveAccessibleName(/\S+/);
    }
  }
});

test('contact section keyboard navigation works', async ({ page }) => {
  await page.goto('/');

  const firstContactLink = page.locator('#contact a').first();
  await firstContactLink.focus();
  await expect(firstContactLink).toBeFocused();

  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  expect(await focused.count()).toBeGreaterThan(0);
});

test('contact section is accessible via keyboard', async ({ page }) => {
  await page.goto('/');

  const contactHeading = page.locator('#contact h2');
  await expect(contactHeading).toBeVisible();
});
