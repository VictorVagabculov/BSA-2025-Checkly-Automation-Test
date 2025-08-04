import { expect } from '@playwright/test';
import { ApiControllers } from '../../api/controllers/api-controllers';
import { registerResponseSchema, loginResponseSchema, authMeSchema } from '../../api/schemas/auth-schemas';
import { errorSchema } from '../../api/schemas/error-schemas';
import { expectToMatchSchema } from '../../helpers/schema-validator';

export async function expectSuccessfulRegistration(api: ApiControllers, email: string, name: string, password: string) {
    const response = await api.auth.register(email, name, password);
    const responseBody = await response.json();

    expect(response.status(), 'Status Code should be 201').toBe(201);
    expectToMatchSchema(responseBody, registerResponseSchema);

    return { response, responseBody };
}

export async function expectRegistrationError(
    api: ApiControllers,
    email: string,
    name: string,
    password: string,
    expectedStatus: number,
    expectedMessage?: string,
) {
    const response = await api.auth.register(email, name, password);
    const responseBody = await response.json();

    expect(response.status()).toBe(expectedStatus);
    expectToMatchSchema(responseBody, errorSchema);

    if (expectedMessage) {
        expect(responseBody.message).toBe(expectedMessage);
    }

    return { response, responseBody };
}

export async function expectSuccessfulLogin(api: ApiControllers, email: string, password: string) {
    const response = await api.auth.login(email, password);
    const responseBody = await response.json();

    expect(response.status(), 'Status Code should be 200').toBe(200);
    expectToMatchSchema(responseBody, loginResponseSchema);

    return { response, responseBody };
}

export async function expectLoginError(
    api: ApiControllers,
    email: string,
    password: string,
    expectedStatus: number,
    expectedMessage?: string,
) {
    const response = await api.auth.login(email, password);
    const responseBody = await response.json();

    expect(response.status()).toBe(expectedStatus);
    expectToMatchSchema(responseBody, errorSchema);

    if (expectedMessage) {
        expect(responseBody.message).toBe(expectedMessage);
    }

    return { response, responseBody };
}

export async function expectSuccessfulAuthMe(api: ApiControllers, token: string, userId: number) {
    const response = await api.auth.authMe(token);
    const responseBody = await response.json();

    expect(response.status(), 'Status Code should be 200').toBe(200);
    expectToMatchSchema(responseBody, authMeSchema);
    expect(responseBody.id).toBe(userId);

    return { response, responseBody };
}

export async function expectAuthMeError(api: ApiControllers, token: string) {
    const response = await api.auth.authMe(token);
    const responseBody = await response.json();

    expect(response.status(), 'Status Code should be 401').toBe(401);
    expectToMatchSchema(responseBody, errorSchema);
    expect(responseBody.message).toBe('Authentication failed.');

    return { response, responseBody };
}
