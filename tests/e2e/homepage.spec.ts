import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'House of Edtech' }),
  ).toBeVisible();
  await expect(page.getByText('Developer name')).toBeVisible();
  await expect(
    page.getByText(/Update your name and profile links/),
  ).toBeVisible();
});
