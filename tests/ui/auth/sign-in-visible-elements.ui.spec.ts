import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';

test('[Sign in - UI] All required fields are visible and properly configured', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await expect(signInPage.emailInput).toBeVisible();
    await expect(signInPage.emailInput).toHaveAttribute('type', 'email');
    await expect(signInPage.emailInput).toHaveAttribute('placeholder', 'Enter your email');

    await expect(signInPage.passwordInput).toBeVisible();
    await expect(signInPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(signInPage.passwordInput).toHaveAttribute('placeholder', 'Enter your password');

    await expect(signInPage.submitButton).toBeVisible();
});
