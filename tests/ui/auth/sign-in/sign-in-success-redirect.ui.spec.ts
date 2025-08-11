import { test, expect } from '@ui/fixtures/user.fixture';
import { SignInPage } from '@ui/controllers/SignInPage';

test.describe('[Sign in - UI] Successful login redirects to dashboard', () => {
    test('Redirects to dashboard on successful login', async ({ page, testUser }) => {
        // Act: perform sign in with valid credentials
        const signIn = new SignInPage(page);
        await signIn.goto();
        await signIn.fillForm(testUser.email, testUser.password);
        await signIn.submit();

        // Assert #1: user is redirected to /dashboard
        await expect(page).toHaveURL(/\/dashboard\/?$/);

        // Assert #2: dashboard-specific content is visible
        await expect(page.getByText('Dashboard placeholder')).toBeVisible();
        await expect(page.getByRole('navigation').getByRole('link', { name: /^Dashboard$/ })).toBeVisible();
        await expect(page.getByRole('navigation').getByRole('link', { name: /My plan/i })).toBeVisible();

        // Assert #3 (optional): sign-in form is no longer present
        await expect(page.getByRole('button', { name: /sign in/i })).toHaveCount(0);
    });
});
