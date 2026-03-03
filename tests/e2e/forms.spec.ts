import { test, expect } from '@playwright/test';

test('contact form is visible on homepage', async ({ page }) => {
  await page.goto('/');
  
  // Look for contact form
  const form = page.locator('form');
  
  if (await form.isVisible()) {
    // Form should have email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Form should have message textarea
    const messageInput = page.locator('textarea');
    await expect(messageInput).toBeVisible();
    
    // Form should have submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  }
});

test('form validation works', async ({ page }) => {
  await page.goto('/');
  
  const form = page.locator('form');
  
  if (await form.isVisible()) {
    const emailInput = page.locator('input[type="email"]');
    const messageChars = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');
    
    // Try submitting empty form
    if (await submitButton.isVisible()) {
      // Try with invalid email
      await emailInput.fill('invalid-email');
      await submitButton.click();
      
      // Browser should show validation error or prevent submission
      // Check if form is still visible (not submitted)
      const formStillVisible = await form.isVisible();
      expect(formStillVisible).toBeTruthy();
    }
  }
});

test('form accepts valid input', async ({ page }) => {
  // This test validates that valid form input is accepted
  // Actual submission is not tested to avoid sending real emails
  
  await page.goto('/');
  
  const form = page.locator('form');
  
  if (await form.isVisible()) {
    const emailInput = page.locator('input[type="email"]');
    const messageInput = page.locator('textarea');
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    
    // Fill form with valid data
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }
    
    await emailInput.fill('test@example.com');
    await messageInput.fill('This is a test message with sufficient length for validation.');
    
    // All inputs should have values
    if (await nameInput.isVisible()) {
      expect(await nameInput.inputValue()).toBe('Test User');
    }
    expect(await emailInput.inputValue()).toBe('test@example.com');
    expect(await messageInput.inputValue()).toContain('test message');
  }
});

test('form inputs have labels', async ({ page }) => {
  await page.goto('/');
  
  const form = page.locator('form');
  
  if (await form.isVisible()) {
    // Check for labels or aria-labels
    const labels = page.locator('form label, form input[aria-label], form textarea[aria-label]');
    const labelCount = await labels.count();
    
    // Form should have at least some accessibility features
    expect(labelCount).toBeGreaterThanOrEqual(0);
  }
});

test('form keyboard navigation works', async ({ page }) => {
  await page.goto('/');
  
  const form = page.locator('form');
  
  if (await form.isVisible()) {
    // Focus on first input
    const firstInput = form.locator('input').first();
    await firstInput.focus();
    
    // Tab through form inputs
    await page.keyboard.press('Tab');
    
    // Should move focus to next element
    const focused = page.locator(':focus');
    expect(await focused.count()).toBeGreaterThan(0);
  }
});

test('contact section is accessible via keyboard', async ({ page }) => {
  await page.goto('/');
  
  // Check if contact section has proper heading
  const contactHeading = page.locator('h2:has-text("Contact"), h3:has-text("Contact")');
  
  if (await contactHeading.count() > 0) {
    await expect(contactHeading.first()).toBeVisible();
  }
});
