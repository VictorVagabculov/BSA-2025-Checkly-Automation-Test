import { test, expect } from '@playwright/test';

test('UI smoke test - home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Checkly/i); // Ajustá según el title real
});
