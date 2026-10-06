import type { Env } from 'hono';
import { env } from 'hono/adapter';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { Bindings } from '../types/index.js';
import { parseJsonObject } from '../utils/index.js';

export const authBot = createMiddleware<Env>(async (ctx, next) => {
    const { APPLICATION_ID, BOT_TOKEN } = env<Bindings>(ctx);
    const { applicationId, botToken } = await parseJsonObject(
        await ctx.req.text(),
    );
    if (!applicationId || !botToken) {
        throw new HTTPException(401);
    }
    if (applicationId != APPLICATION_ID || botToken != BOT_TOKEN) {
        throw new HTTPException(403);
    }
    await next();
});
