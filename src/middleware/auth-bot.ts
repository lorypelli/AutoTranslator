import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '../types/index.js';
import { getBindings, parseJsonObject } from '../utils/index.js';

export const authBot = createMiddleware<AppEnv>(async (ctx, next) => {
    const { APPLICATION_ID, BOT_TOKEN } = getBindings(ctx);
    const body = await ctx.req.text();
    const { applicationId, botToken } = await parseJsonObject<
        'applicationId' | 'botToken'
    >(body);
    if (typeof applicationId != 'string' || typeof botToken != 'string') {
        throw new HTTPException(401, {
            message: 'The application ID and bot token are required.',
        });
    }
    if (applicationId != APPLICATION_ID || botToken != BOT_TOKEN) {
        throw new HTTPException(403, {
            message: 'The application ID or bot token is wrong.',
        });
    }
    await next();
});
