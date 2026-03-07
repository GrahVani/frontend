// Zod v4 schemas for auth API responses (API-007/API-008)

import { z } from 'zod';

export const authTokensSchema = z.object({
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    tokens: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
    }).optional(),
    user: z.record(z.string(), z.unknown()).optional(),
}).check(
    (ctx) => {
        if (!ctx.value.accessToken && !ctx.value.tokens?.accessToken) {
            ctx.issues.push({
                code: 'custom',
                input: ctx.value,
                message: 'Response must contain accessToken either at root or in tokens object',
                path: ['accessToken'],
            });
        }
    }
);

export const loginResponseSchema = authTokensSchema;
export const registerResponseSchema = authTokensSchema;

export type ValidatedAuthTokens = z.infer<typeof authTokensSchema>;
