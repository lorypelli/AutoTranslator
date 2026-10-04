import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { env } from 'hono/adapter';
import type { Bindings } from '../types/index.js';

export const authBot = createMiddleware(async (ctx, next) => {
    const { APPLICATION_ID, BOT_TOKEN } = env<Bindings>(ctx);
    const id = ctx.req.header('X-Application-ID');
    const token = ctx.req.header('X-Bot-Token');
    if (!id || !token) {
        throw new HTTPException(401);
    }
    if (id != APPLICATION_ID || token != BOT_TOKEN) {
        throw new HTTPException(403);
    }
    await next();
});
