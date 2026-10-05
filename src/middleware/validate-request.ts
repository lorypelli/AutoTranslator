import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { RequestEnv } from '../types/index.js';
import { parseJsonObject } from '../utils/index.js';

export const validateRequest = createMiddleware<RequestEnv>(
    async (ctx, next) => {
        const { language, messages } = await parseJsonObject(
            await ctx.req.text(),
        );
        if (
            typeof language != 'string' ||
            !Array.isArray(messages) ||
            !messages.length ||
            !messages.every((message) => typeof message == 'string')
        ) {
            throw new HTTPException(400);
        }
        ctx.set('language', language);
        ctx.set('messages', messages);
        await next();
    },
);
