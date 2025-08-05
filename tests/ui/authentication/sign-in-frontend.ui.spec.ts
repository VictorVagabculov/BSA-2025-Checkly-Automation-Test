import { test, expect } from '@playwright/test';
import { SignInController } from '../../../ui/controllers/signInController';

test('TC16 - Required field validation', async ({ page }) => {
  const signIn = new SignInController(page);
  await signIn.goto();

  await test.step('Submit form without filling any field', async () => {
    await signIn.submit();
  });

  await test.step('Check for required field validation messages', async () => {
    // Expect two identical error messages rendered for email and password
    await expect(page.getByText('Field is required')).toHaveCount(2);
  });
});