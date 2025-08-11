import { test as base, expect as baseExpect } from '@playwright/test';
import { test, expect } from '@ui/fixtures/user.fixture';
import { SignInPage } from '@ui/controllers/SignInPage';
import { signUpUser } from '@ui/helpers/auth';

/**
 * Consolidated Sign In UI suite.
 * Uses the worker-scoped testUser fixture where needed.
 * Note: we refresh the page after each test to satisfy the requested behavior,
 * even though Playwright creates a fresh context/page per test by default.
 */

test.describe('[Sign in - UI] Consolidated suite', () => {
    test.afterEach(async ({ page }) => {
        // Refresh between tests as requested
        await page.reload();
    });

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

    test.describe('[Sign In - UI] Form validation highlights required fields', () => {
        test.beforeEach(async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.goto();
        });

        test('Should mark both email and password as invalid when both are empty', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.submit();

            const invalidInputs = signInPage.page.locator('input:invalid');
            await expect(invalidInputs).toHaveCount(2);
        });

        test('Should mark email as invalid when only password is filled', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.passwordInput.fill('SomePassword123');
            await signInPage.submit();

            const invalidInputs = signInPage.page.locator('input:invalid');
            await expect(invalidInputs).toHaveCount(1);
            await expect(invalidInputs.first()).toHaveAttribute('name', 'email');
        });

        test('Should mark password as invalid when only email is filled', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.emailInput.fill('user@example.com');
            await signInPage.submit();

            const invalidInputs = signInPage.page.locator('input:invalid');
            await expect(invalidInputs).toHaveCount(1);
            await expect(invalidInputs.first()).toHaveAttribute('name', 'password');
        });
    });

    test.describe('[Sign In - UI] Invalid email format blocks submission (backend validation)', () => {
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

    test.describe('[Sign In - UI] Invalid password format blocks submission (backend validation)', () => {
        const invalidPasswords = [
            { password: 'Pa1', reason: 'too short' },
            { password: 'password1', reason: 'no uppercase' },
            { password: 'PASSWORD1', reason: 'no lowercase' },
            { password: 'Password', reason: 'no digits' },
            { password: 'Password1234567891011121314151617181920', reason: 'too long' },
            { password: 'Password 1', reason: 'contains space' },
        ];

        test.beforeEach(async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.goto();
        });

        for (const { password, reason } of invalidPasswords) {
            test(`Should show backend error for password with issue: ${reason}`, async ({ page }) => {
                const signInPage = new SignInPage(page);
                await signInPage.fillForm('user@example.com', password);
                await signInPage.submit();

                const error = signInPage.page.getByText(
                    /Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit/i,
                );
                await expect(error).toBeVisible({ timeout: 5000 });
            });
        }
    });

    test.describe('[Sign In - UI] Shows error for invalid credentials', () => {
        test.beforeEach(async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.goto();
        });

        test('Displays error when credentials are invalid', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.fillForm('sadasdas@asdasd.com', 'WrongPassword123');
            await signInPage.submit();

            await expect(signInPage.errorMessage).toBeVisible();
        });
    });

    test.describe('[Sign In - UI] Unsuccessful login - incorrect password', () => {
        test('Shows "Invalid credentials" when password is wrong', async ({ page }) => {
            const email = 'test@email.com';
            const correctPassword = 'CorrectPass123';
            const wrongPassword = 'WrongPass123';

            // Arrange: create a valid user via API
            await signUpUser(email, correctPassword);

            // Act: attempt login with wrong password
            const signIn = new SignInPage(page);
            await signIn.goto();
            await signIn.fillForm(email, wrongPassword);
            await signIn.submit();

            // Assert: toast/banner should show the generic error
            await expect(signIn.errorMessage).toBeVisible();
        });
    });

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
});
