import { test as baseTest } from '@playwright/test';
import { ApiControllers } from '../../api/controllers/api-controllers';

export const test = baseTest.extend<{
    api: ApiControllers;
}>({
    api: async ({ request }, use) => {
        const api = new ApiControllers(request);
        await use(api);
    },
});

export { expect } from '@playwright/test';
