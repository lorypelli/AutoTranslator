import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { authBot, validateRequest } from '../middleware/index.js';
import type { Bindings, RequestEnv } from '../types/index.js';
import { translateMessages } from '../utils/index.js';

export const request = new Hono<RequestEnv>();

request.post('/', authBot, validateRequest, async (ctx) => {
    const translations = await translateMessages(
        env<Bindings>(ctx),
        ctx.get('messages'),
        ctx.get('language'),
    );
    return ctx.json({ success: true, translations });
});
