import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';

test.describe('[Sign In - UI] Shows error for invalid credentials', () => {
    let signInPage: SignInPage;

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    test('Displays error when credentials are invalid', async () => {
        await signInPage.fillForm('sadasdas@asdasd.com', 'WrongPassword123');
        await signInPage.submit();

        await expect(signInPage.errorMessage).toBeVisible();
    });
});
