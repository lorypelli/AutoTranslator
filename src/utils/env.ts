import type { Context } from 'hono';
import { env } from 'hono/adapter';
import { HTTPException } from 'hono/http-exception';
import type { RawBindings } from '../types/index.js';

export function getBindings(ctx: Context) {
    const raw = env<RawBindings>(ctx);
    const { AI, LANGUAGES } = raw;
    const { hostname } = new URL(ctx.req.url);
    if (hostname == raw.PROD_HOSTNAME) {
        return {
            AI,
            LANGUAGES,
            APPLICATION_ID: raw.PROD_APPLICATION_ID,
            PUBLIC_KEY: raw.PROD_PUBLIC_KEY,
            BOT_TOKEN: raw.PROD_BOT_TOKEN,
        };
    }
    if (hostname == raw.DEV_HOSTNAME) {
        return {
            AI,
            LANGUAGES,
            APPLICATION_ID: raw.DEV_APPLICATION_ID,
            PUBLIC_KEY: raw.DEV_PUBLIC_KEY,
            BOT_TOKEN: raw.DEV_BOT_TOKEN,
        };
    }
    throw new HTTPException(400, {
        message: 'This host is not configured.',
    });
}
