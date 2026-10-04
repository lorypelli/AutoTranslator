import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { BotEnv } from '../types/index.js';

export const authBot = createMiddleware<BotEnv>(async (ctx, next) => {
    const id = ctx.req.header('X-Application-ID');
    const token = ctx.req.header('X-Bot-Token');
    if (!id || !token) {
        throw new HTTPException(401);
    }
    if (id != process.env.APPLICATION_ID || token != process.env.BOT_TOKEN) {
        throw new HTTPException(403);
    }
    ctx.set('id', id);
    ctx.set('token', token);
    await next();
});
