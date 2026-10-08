import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { translateMessages, withTimeout } from '../ai/index.js';
import { authBot, validateChat } from '../middleware/index.js';
import type { Bindings, ChatEnv } from '../types/index.js';

export const chat = new Hono<ChatEnv>();

chat.post('/', authBot, validateChat, async (ctx) => {
    const messages = ctx.get('messages');
    const language = ctx.get('language');
    const translations = await withTimeout(
        translateMessages(env<Bindings>(ctx), messages, language),
    );
    return ctx.json({ success: true, translations });
});
