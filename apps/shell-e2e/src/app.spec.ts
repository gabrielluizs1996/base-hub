import { test, expect } from '@playwright/test';

test.describe('should load app and show main content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Gerenciamento de Ordens/i }),
    ).toBeVisible();
  });
});
