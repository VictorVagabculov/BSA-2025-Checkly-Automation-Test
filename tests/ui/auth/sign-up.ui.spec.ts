// tests/ui/auth/sign-up.ui.spec.ts
import { test, expect } from '@ui/fixtures/user.fixture';
import { signUpUser } from '@ui/helpers/auth';
import { SignUpPage } from '@ui/controllers/SignUpPage';
import { uniqueEmail, validPassword, randomName } from '@ui/helpers/userData';

test.describe('[Sign up - UI] Consolidated suite', () => {
    test.afterEach(async ({ page }) => {
        // Explicit refresh between tests (isolation already exists, but requested)
        await page.reload();
    });

    // 1) Required elements are visible and typed correctly
    test('[Sign up - UI] All required form elements are visible and properly configured', async ({ page }) => {
        const signUp = new SignUpPage(page);
        await signUp.goto();
        await signUp.validateRequiredFieldsVisibleAndTyped();
    });

    // 2) Required-field behavior (prevent submission with missing inputs)
    test.describe('[Sign up - UI] Fields are marked as required', () => {
        test.beforeEach(async ({ page }) => {
            const signUp = new SignUpPage(page);
            await signUp.goto();
        });

        test('Blocks submission when all fields are empty', async ({ page }) => {
            const signUp = new SignUpPage(page);
            await signUp.submit();
            await signUp.expectOnRegisterUrl();
            await expect(page.locator('input:invalid').first()).toBeVisible();
        });

        test('Blocks submission when only Name is filled', async ({ page }) => {
            const signUp = new SignUpPage(page);
            await signUp.fillName(randomName());
            await signUp.submit();
            await signUp.expectOnRegisterUrl();
            await expect(page.locator('input:invalid').first()).toBeVisible();
        });

        test('Blocks submission when Email is filled but Password empty', async ({ page }) => {
            const signUp = new SignUpPage(page);
            await signUp.fillName(randomName());
            await signUp.fillEmail(uniqueEmail());
            await signUp.submit();
            await signUp.expectOnRegisterUrl();
            await expect(page.locator('input:invalid').first()).toBeVisible();
        });

        test('Blocks submission when Password is filled but Confirm Password empty', async ({ page }) => {
            const signUp = new SignUpPage(page);
            await signUp.fillName(randomName());
            await signUp.fillEmail(uniqueEmail());
            await signUp.fillPassword('Password123');
            await signUp.submit();
            await signUp.expectOnRegisterUrl();
            await expect(page.locator('input:invalid').first()).toBeVisible();
        });
    });

    // 3) Happy path – successful submission
    test.describe('[Sign up - UI] Successful form submission redirects or shows success message', () => {
        // Run multiple times to mimic parametrized data from the JSON using faker-backed helpers
        for (let i = 0; i < 6; i++) {
            test(`Succeeds with valid, faker-generated data #${i + 1}`, async ({ page }) => {
                const signUp = new SignUpPage(page);
                await signUp.goto();

                const name = randomName();
                const email = uniqueEmail();
                const password = validPassword();

                await signUp.fillForm({
                    name,
                    email,
                    password,
                    confirmPassword: password,
                });
                await signUp.submit();
                await signUp.expectSuccessRedirect();
            });
        }
    });

    // 4) Already-registered email error
    test('[Sign up - UI] Attempt to register with an already registered email', async ({ page }) => {
        const email = uniqueEmail();
        const password = validPassword();
        const name = randomName();

        // Pre-create the account through API; tolerate existing to keep test idempotent
        await signUpUser(email, password, name, { tolerateExisting: true });

        const signUp = new SignUpPage(page);
        await signUp.goto();
        await signUp.fillForm({ name, email, password, confirmPassword: password });
        await signUp.submit();

        await expect(signUp.emailInUseError).toBeVisible({ timeout: 10000 });
        await signUp.expectOnRegisterUrl();
    });

    // 5) Mismatched password confirmation
    test('[Sign up - UI] Password and confirm password must match', async ({ page }) => {
        const signUp = new SignUpPage(page);
        await signUp.goto();

        await signUp.fillForm({
            name: randomName(),
            email: uniqueEmail(),
            password: 'Password123',
            confirmPassword: 'Password456',
        });
        await signUp.submit();

        await signUp.expectOnRegisterUrl();
        await expect(signUp.passwordMismatchError).toBeVisible();
    });

    // 6) Invalid email format matrix (static negative samples are acceptable)
    test.describe('[Sign up - UI] Shows error when email format is invalid', () => {
        const invalidEmails = [
            'plainaddress',
            '@missinglocal.com',
            'user@',
            '.user@domain.com',
            'user.@domain.com',
            'user@-domain.com',
            'user@domain-.com',
            'user@domain..com',
            'user@.domain.com',
            'user@domain_.com',
        ];

        invalidEmails.forEach((badEmail, idx) => {
            test(`Invalid email format #${idx + 1}: ${badEmail}`, async ({ page }) => {
                const signUp = new SignUpPage(page);
                await signUp.goto();

                await signUp.fillForm({
                    name: randomName(),
                    email: badEmail,
                    password: 'Password123',
                    confirmPassword: 'Password123',
                });
                await signUp.submit();

                await signUp.expectOnRegisterUrl();
                await expect(signUp.emailFormatError).toBeVisible({ timeout: 10000 });
            });
        });
    });

    // 7) Weak/invalid password matrix (static negative samples accepted)
    test.describe('[Sign up - UI] Shows error when password is weak or invalid', () => {
        const weakPasswords = [
            'short1A', // too short
            'nouppercase123', // no uppercase
            'NOLOWERCASE123,', // no lowercase (includes comma)
            'NoDigitsHere!', // no digits
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1a', // > 32 chars
        ];

        weakPasswords.forEach((pwd, idx) => {
            test(`Weak/invalid password #${idx + 1}`, async ({ page }) => {
                const signUp = new SignUpPage(page);
                await signUp.goto();

                await signUp.fillForm({
                    name: randomName(),
                    email: uniqueEmail(),
                    password: pwd,
                    confirmPassword: pwd,
                });
                await signUp.submit();

                await signUp.expectOnRegisterUrl();
                await expect(signUp.passwordPolicyError).toBeVisible({ timeout: 10000 });
            });
        });
    });

    // 8) Invalid name length (static edge cases)
    test.describe('[Sign up - UI] Registration fails when name has invalid length', () => {
        const badNames = ['Vi', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA']; // <3 and >32

        badNames.forEach((badName, idx) => {
            test(`Invalid name length #${idx + 1}`, async ({ page }) => {
                const signUp = new SignUpPage(page);
                await signUp.goto();

                await signUp.fillForm({
                    name: badName,
                    email: uniqueEmail(),
                    password: 'Password123',
                    confirmPassword: 'Password123',
                });
                await signUp.submit();

                await signUp.expectOnRegisterUrl();
                await expect(signUp.nameLengthError).toBeVisible({ timeout: 10000 });
            });
        });
    });
});
