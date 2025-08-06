import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';

test.describe('[Sign In - UI] Form validation blocks submission when required fields are empty', () => {
    let signInPage: SignInPage;

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    test('Should prevent submission if both fields are empty', async () => {
        await signInPage.submit();
        await expect(signInPage.emailInput).toBeVisible(); // still on the same page
    });

    test('Should prevent submission if email is empty', async () => {
        await signInPage.passwordInput.fill('Password123');
        await signInPage.submit();
        await expect(signInPage.emailInput).toBeVisible(); // still on the same page
    });

    test('Should prevent submission if password is empty', async () => {
        await signInPage.emailInput.fill('user@example.com');
        await signInPage.submit();
        await expect(signInPage.passwordInput).toBeVisible(); // still on the same page
    });
});
