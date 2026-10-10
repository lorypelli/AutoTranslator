import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { getBindings, parseJsonObject } from '../utils/index.js';

export const authBot = createMiddleware<Env>(async (ctx, next) => {
    const { APPLICATION_ID, BOT_TOKEN } = getBindings(ctx);
    const body = await ctx.req.text();
    const { applicationId, botToken } = await parseJsonObject(body);
    if (!applicationId || !botToken) {
        throw new HTTPException(401);
    }
    if (applicationId != APPLICATION_ID || botToken != BOT_TOKEN) {
        throw new HTTPException(403);
    }
    await next();
});
