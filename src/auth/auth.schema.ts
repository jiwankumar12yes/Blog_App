import { z } from 'zod';

export const registerSchema=z.object({
    body:z.object({
        username:z.string().min(4).max(10),
        email: z.string().email("Invalid email format"),
        password:z.string().min(8),
    })
});

export const loginSchema=z.object({
    body:z.object({
        email:z.string().email("Invalid email format"),
        password:z.string().min(8),
    })
});

export const refreshTokenSchema=z.object({
    body:z.object({
        refreshToken:z.string(),
    })
});

export type RegisterInput=z.infer<typeof registerSchema>['body'];
export type LoginInput=z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput=z.infer<typeof refreshTokenSchema>['body'];