import { test } from '@playwright/test';

test('Print API_URL env var', async () => {
    console.log('✅ API_URL:', process.env.API_URL);
});
test('Print BASE_URL env var', async () => {
    console.log('✅ BASE_URL:', process.env.BASE_URL);
});
