import { Page, Locator, expect } from '@playwright/test';

/**
 * SignUpPage POM
 * - Accessible-first locators (roles + accessible names) matching your JSX.
 * - Defensive navigation to /sign-up with form readiness check.
 * - Tolerant field-type validation (email input is type="text" in your form).
 */
export class SignUpPage {
    readonly page: Page;

    // Inputs
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;

    // Actions
    readonly submitButton: Locator;

    // Inline errors (copy-tolerant)
    readonly emailInUseError: Locator;
    readonly emailFormatError: Locator;
    readonly passwordPolicyError: Locator;
    readonly passwordMismatchError: Locator;
    readonly nameLengthError: Locator;

    constructor(page: Page) {
        this.page = page;

        // Match <Input label="..."> components rendered as textboxes with those labels
        this.nameInput = page.getByRole('textbox', { name: /^Name$/i });
        this.emailInput = page.getByRole('textbox', { name: /^Email$/i });
        this.passwordInput = page.getByRole('textbox', { name: /^Password$/i }).first(); // main password
        this.confirmPasswordInput = page.getByRole('textbox', { name: /Confirm password/i });

        // Match <Button label="Create an account">
        this.submitButton = page.getByRole('button', { name: /create an account/i });

        // Error messages (kept flexible for minor copy changes)
        this.emailInUseError = page.getByText(/email already in use/i);
        this.emailFormatError = page.getByText(/email is not in a valid format|invalid email/i);
        this.passwordPolicyError = page.getByText(
            /password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit/i,
        );
        this.passwordMismatchError = page.getByText(/passwords (do\s*not|don['’]t) match/i);
        this.nameLengthError = page.getByText(
            /name\s+must\s+(?:be\s+between\s+3\s+and\s+32|have\s+at\s+least\s+3\s+characters\s+and\s+maximum\s+of\s+32)\s+characters/i,
        );
    }

    /** Navigate to the sign-up screen and wait until the form is ready */
    async goto() {
        await this.page.goto('/sign-up', { waitUntil: 'domcontentloaded' });
        await expect(this.page).toHaveURL(/\/sign-up\/?$/);
        await this.submitButton.waitFor({ state: 'visible' });
    }

    // ---------- Fill helpers ----------

    async fillName(value: string) {
        await this.nameInput.fill(value);
    }
    async fillEmail(value: string) {
        await this.emailInput.fill(value);
    }
    async fillPassword(value: string) {
        await this.passwordInput.fill(value);
    }
    async fillConfirmPassword(value: string) {
        await this.confirmPasswordInput.fill(value);
    }

    async fillForm(params: { name?: string; email?: string; password?: string; confirmPassword?: string }) {
        const { name, email, password, confirmPassword } = params;
        if (name !== undefined) await this.fillName(name);
        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);
        if (confirmPassword !== undefined) await this.fillConfirmPassword(confirmPassword);
    }

    async submit() {
        await this.submitButton.click();
    }

    /** Expect to still be on the sign-up page (used by negative cases) */
    async expectOnRegisterUrl() {
        await expect(this.page).toHaveURL(/\/sign-up\/?$/);
    }

    /** Accept either redirect to sign-in or to dashboard after success */
    async expectSuccessRedirect() {
        await expect(this.page).toHaveURL(/\/(sign-in|dashboard)\/?$/);
    }

    /**
     * Sanity: required fields are visible and typed.
     * - Name: JS property 'type' must be 'text' (attribute may be omitted).
     * - Email: accept 'text' OR 'email' (your form uses type="text").
     * - Passwords: if 'type' attribute exists, it must be 'password'.
     */
    async validateRequiredFieldsVisibleAndTyped() {
        await expect(this.page.getByRole('form', { name: /create an account/i })).toBeVisible();

        // Name
        await expect(this.nameInput).toBeVisible();
        await expect.soft(this.nameInput).toHaveJSProperty('type', 'text');

        // Email (tolerate 'text' or 'email')
        await expect(this.emailInput).toBeVisible();
        const emailType = (await this.emailInput.getAttribute('type'))?.toLowerCase();
        if (emailType) {
            expect.soft(['email', 'text']).toContain(emailType);
        }

        // Password
        await expect(this.passwordInput).toBeVisible();
        const pwdType = (await this.passwordInput.getAttribute('type'))?.toLowerCase();
        if (pwdType) {
            expect.soft(pwdType).toBe('password');
        }

        // Confirm password
        await expect(this.confirmPasswordInput).toBeVisible();
        const cpwdType = (await this.confirmPasswordInput.getAttribute('type'))?.toLowerCase();
        if (cpwdType) {
            expect.soft(cpwdType).toBe('password');
        }

        // Submit button
        await expect(this.submitButton).toBeVisible();
    }
}
