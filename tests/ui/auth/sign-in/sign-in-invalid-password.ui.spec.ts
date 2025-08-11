import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';
import { signUpUser } from '@ui/helpers/auth';

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
        await expect(signIn.errorMessage).toBeVisible(); // SignInPage.errorMessage => /Invalid credentials/i
    });
});
