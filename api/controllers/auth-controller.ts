import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthController {
    constructor(private requestContext: APIRequestContext) {}

    async login(email: string, password: string): Promise<APIResponse> {
        const response = await this.requestContext.post('auth/login', {
            data: {
                email,
                password,
            },
        });

        return response;
    }

    async register(email: string, name: string, password: string): Promise<APIResponse> {
        const response = await this.requestContext.post('auth/register', {
            data: {
                email,
                name,
                password,
            },
        });

        return response;
    }

    async authMe(token: string): Promise<APIResponse> {
        const response = await this.requestContext.get('auth/me', {
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {},
        });

        return response;
    }
}
