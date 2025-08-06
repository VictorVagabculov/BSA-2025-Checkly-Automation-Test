import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';

test.describe('[Sign In - UI] Form validation highlights required fields', () => {
    let signInPage: SignInPage;

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    test('Should mark both email and password as invalid when both are empty', async () => {
        await signInPage.submit();

        const invalidInputs = signInPage.page.locator('input:invalid');
        await expect(invalidInputs).toHaveCount(2);

        const names = await invalidInputs.evaluateAll((elements) => elements.map((el) => el.getAttribute('name')));
        expect(names).toContain('email');
        expect(names).toContain('password');
    });

    test('Should mark email as invalid when only password is filled', async () => {
        await signInPage.passwordInput.fill('Password123');
        await signInPage.submit();

        const invalidInputs = signInPage.page.locator('input:invalid');
        await expect(invalidInputs).toHaveCount(1);
        await expect(invalidInputs.first()).toHaveAttribute('name', 'email');
    });

    test('Should mark password as invalid when only email is filled', async () => {
        await signInPage.emailInput.fill('user@example.com');
        await signInPage.submit();

        const invalidInputs = signInPage.page.locator('input:invalid');
        await expect(invalidInputs).toHaveCount(1);
        await expect(invalidInputs.first()).toHaveAttribute('name', 'password');
    });
});
