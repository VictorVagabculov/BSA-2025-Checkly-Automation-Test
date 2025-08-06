import { Page, Locator } from '@playwright/test';

export class SignInPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly linkToSignUp: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.getByPlaceholder('Enter your password');
        this.submitButton = page.getByRole('button', { name: /sign in/i });
        this.linkToSignUp = page.getByRole('link', { name: /create an account/i });
    }

    async goto() {
        await this.page.goto('/sign-in');
    }

    get errorMessage() {
        return this.page.getByText(/user not found/i);
    }

    async fillForm(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async submit() {
        await this.submitButton.click();
    }
}
