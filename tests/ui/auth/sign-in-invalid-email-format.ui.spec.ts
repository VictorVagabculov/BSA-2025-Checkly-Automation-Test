import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';

const invalidEmails = [
    'emoji😊@invalid-characters.com',
    '测试电子邮件@invalid-characters.com',
    'invalid-format.com',
    '.localstartswithdot@test.com',
    'localendswithdot.@test.com',
    'repeated..dots@test.com',
    'valid@-domainstartswithhyphen.com',
    'valid@domainendswithhyphen-.com',
    'valid@.domainstartswithdot.com',
    'valid@domainendswithdot.com.',
];

test.describe('[Sign In - UI] Invalid email format blocks submission (backend validation)', () => {
    for (const email of invalidEmails) {
        test(`Should show backend error for invalid email: ${email}`, async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.goto();

            await signInPage.fillForm(email, 'ValidPassword123');
            await signInPage.submit();

            // Retry-safe backend error validation
            await expect(signInPage.emailErrorMessage).toBeVisible({ timeout: 10000 });

            // Assert user is still on Sign In page
            await expect(page).toHaveURL(/sign-in/);
        });
    }
});
