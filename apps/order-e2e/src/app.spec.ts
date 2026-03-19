import { test, expect } from '@playwright/test';

test.describe('has title', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display Export CSV button', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Exportar CSV' });
    await expect(exportButton).toBeVisible();
  });
});
