import { expect, test } from '@playwright/test';

test('command palette filters and opens a case study from the keyboard', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('ControlOrMeta+K');

  const dialog = page.getByRole('dialog', { name: /quick navigation/i });
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('command-palette-input')).toBeFocused();

  await page.getByTestId('command-palette-input').fill('Throughline');
  await expect(dialog.getByRole('option', { name: /throughline/i })).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/throughline\/$/);
});

test('command palette uses Portuguese case-study paths and restores focus after escape', async ({ page }) => {
  await page.goto('/pt/');

  const trigger = page.getByTestId('command-palette-trigger');
  await trigger.focus();
  await page.keyboard.press('ControlOrMeta+K');

  const dialog = page.getByRole('dialog', { name: /navegação rápida/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.keyboard.press('ControlOrMeta+K');
  await page.getByTestId('command-palette-input').fill('Lorebound');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/pt\/projects\/lorebound\/$/);
});
