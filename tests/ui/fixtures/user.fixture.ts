import { test as base, expect } from '@playwright/test';
import { signUpUser } from '../helpers/auth';

type UserFixture = {
    email: string;
    password: string;
};

export const test = base.extend<{}, { testUser: UserFixture }>({
    // Note: The second generic parameter is for "worker" fixtures
    testUser: [
        async ({}, use) => {
            const email = 'ui-test-user@email.com';
            const password = 'CorrectPass123';

            // Create the user once per worker, tolerate if already exists
            await signUpUser(email, password, 'Test User', { tolerateExisting: true });

            await use({ email, password });
        },
        { scope: 'worker' },
    ],
});

export { expect };
