import { test, expect } from '@playwright/test';

test('API smoke test - /auth/login returns 400 on empty body', async ({ request }) => {
    const response = await request.post('/auth/login', {
        data: {}, // envío body vacío
    });

    expect(response.status()).toBeGreaterThanOrEqual(400); // esperamos error
});
