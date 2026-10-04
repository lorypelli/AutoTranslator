import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { RouteBases } from 'discord-api-types/v10';
import { COMMANDS } from '../cmd/index.js';
import { authBot } from '../middleware/index.js';
import type { BotEnv } from '../types/index.js';

export const register = new Hono<BotEnv>();

register.post('/', authBot, async (ctx) => {
    const id = ctx.get('id');
    const token = ctx.get('token');
    const url = `${RouteBases.api}/applications/${id}/commands`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${token}`,
        },
        body: JSON.stringify(COMMANDS.map((command) => command.data)),
    });
    if (!res.ok) {
        throw new HTTPException(500);
    }
    return ctx.json({ success: true });
});
