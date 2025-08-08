import { request } from '@playwright/test';

export async function signUpUser(email: string, password: string): Promise<void> {
    const apiURL = process.env.API_URL;
    if (!apiURL) throw new Error('API_URL is not defined in environment variables');

    const requestContext = await request.newContext();
    const response = await requestContext.post(`${apiURL}/auth/register`, {
        data: { email, password },
    });

    if (!response.ok()) {
        const body = await response.text();
        throw new Error(`Sign up failed: ${response.status()} ${body}`);
    }

    await requestContext.dispose();
}
