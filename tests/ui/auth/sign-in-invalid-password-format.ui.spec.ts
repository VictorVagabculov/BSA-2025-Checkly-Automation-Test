import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';

const validEmail = 'user@example.com';

const invalidPasswords = [
    { password: 'Pa1', reason: 'too short' },
    { password: 'password1', reason: 'no uppercase' },
    { password: 'PASSWORD1', reason: 'no lowercase' },
    { password: 'Password', reason: 'no digits' },
    { password: 'Password1234567891011121314151617181920', reason: 'too long' },
    { password: 'Password 1', reason: 'contains space' },
];

test.describe('[Sign In - UI] Invalid password format blocks submission (backend validation)', () => {
    let signInPage: SignInPage;

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        await signInPage.goto();
    });

    for (const { password, reason } of invalidPasswords) {
        test(`Should show backend error for password with issue: ${reason}`, async () => {
            await signInPage.fillForm(validEmail, password);
            await signInPage.submit();

            const error = signInPage.page.getByText(
                /Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit/i,
            );
            await expect(error).toBeVisible({ timeout: 5000 });
        });
    }
});
