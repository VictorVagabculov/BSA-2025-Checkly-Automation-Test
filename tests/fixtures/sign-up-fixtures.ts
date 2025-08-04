import { test as baseTest } from './base-fixtures';
import { generateUser } from '../../helpers/generators';

export const test = baseTest.extend<{
    validUser: ReturnType<typeof generateUser>;
}>({
    validUser: async ({}, use) => {
        await use(generateUser());
    },
});

export { expect } from '@playwright/test';
