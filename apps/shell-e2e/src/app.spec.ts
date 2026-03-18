import { test, expect } from '@playwright/test';

test('should load app and show main content', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('heading', { name: /Gerenciamento de Ordens/i }),
  ).toBeVisible();
});
