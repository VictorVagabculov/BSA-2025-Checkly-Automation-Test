export const errorSchema = {
    type: 'object',
    properties: {
        errorType: { type: 'string' },
        message: { type: 'string' },
    },
    required: ['errorType', 'message'],
}