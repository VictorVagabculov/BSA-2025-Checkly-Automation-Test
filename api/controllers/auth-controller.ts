import { APIRequestContext, APIResponse } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || '';

export class AuthController {
    constructor(private requestContext: APIRequestContext) {}

    async login(email: string, password: string): Promise<APIResponse> {
        const response = await this.requestContext.post(`${BASE_URL}auth/login`, {
            data: {
                email,
                password,
            },
        });

        return response;
    }

    async register(email: string, name: string, password: string): Promise<APIResponse> {
        const response = await this.requestContext.post(`${BASE_URL}auth/register`, {
            data: {
                email,
                name,
                password,
            },
        });

        return response;
    }

    async authMe(token: string): Promise<APIResponse> {
        const response = await this.requestContext.get(`${BASE_URL}auth/me`, {
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {},
        });

        return response;
    }
}
