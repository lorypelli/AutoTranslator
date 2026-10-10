import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { ChatEnv } from '../types/index.js';
import { isStringArray, parseJsonObject } from '../utils/index.js';

export const validateChat = createMiddleware<ChatEnv>(async (ctx, next) => {
    const body = await ctx.req.text();
    const { language, messages } = await parseJsonObject(body);
    if (
        typeof language != 'string' ||
        !isStringArray(messages) ||
        !messages.length
    ) {
        throw new HTTPException(400, {
            message:
                'A language and a non-empty list of messages are required.',
        });
    }
    ctx.set('language', language);
    ctx.set('messages', messages);
    await next();
});
