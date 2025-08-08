import { test, expect } from '@playwright/test';
import { SignInPage } from '@ui/controllers/SignInPage';
import { signUpUser } from '@tests/ui/helpers/auth';
import { faker } from '@faker-js/faker';

test('Sign In fails with incorrect password', async ({ page, baseURL }) => {
    const email = faker.internet.email();
    const correctPassword = 'CorrectPass123';
    const wrongPassword = 'WrongPass123';

    // Register user before test
    await signUpUser(baseURL!, email, correctPassword);

    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillForm(email, wrongPassword);
    await signInPage.submit();

    await expect(signInPage.errorMessage).toBeVisible(); // "Invalid credentials"
});
