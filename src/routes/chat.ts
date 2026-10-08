import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { authBot, validateChat } from '../middleware/index.js';
import type { Bindings, ChatEnv } from '../types/index.js';
import { translateMessages } from '../utils/index.js';

export const chat = new Hono<ChatEnv>();

chat.post('/', authBot, validateChat, async (ctx) => {
    const translations = await translateMessages(
        env<Bindings>(ctx),
        ctx.get('messages'),
        ctx.get('language'),
    );
    return ctx.json({ success: true, translations });
});
