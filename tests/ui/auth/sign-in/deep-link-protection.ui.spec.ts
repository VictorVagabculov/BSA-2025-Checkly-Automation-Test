import { test, expect } from '@ui/fixtures/user.fixture';
import { SignInPage } from '@ui/controllers/SignInPage';

test.describe('[Sign in - UI] Deep link protection', () => {
    test('Redirects unauthenticated users to sign-in and back to intended route after login', async ({
        page,
        testUser,
    }) => {
        // Step 1: Visit a protected page without being signed in
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/sign-in\/?$/);

        // Step 2: Sign in
        const signIn = new SignInPage(page);
        await signIn.fillForm(testUser.email, testUser.password);
        await signIn.submit();

        // Step 3: Validate user lands on intended protected route
        await expect(page).toHaveURL(/\/dashboard\/?$/);
        await expect(page.getByText('Dashboard placeholder')).toBeVisible();
    });
});
