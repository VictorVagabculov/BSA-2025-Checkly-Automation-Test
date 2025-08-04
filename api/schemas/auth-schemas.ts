export const registerResponseSchema = {
    type: 'object',
    properties: {
        user: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
            },
        },
        token: { type: 'string' },
    },
    required: ['user', 'token'],
};

export const loginResponseSchema = {
    type: 'object',
    properties: {
        user: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
            },
        },
        token: { type: 'string' },
    },
    required: ['user', 'token'],
};

export const authMeSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
    },
    required: ['id', 'email', 'name'],
};
