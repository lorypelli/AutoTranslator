import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { COMMANDS } from '../cmd/index.js';
import { authBot } from '../middleware/index.js';
import type { Bindings } from '../types/index.js';
import { registerCommands } from '../utils/index.js';

export const register = new Hono();

register.post('/', authBot, async (ctx) => {
    await registerCommands(
        env<Bindings>(ctx),
        COMMANDS.map((command) => command.data),
    );
    return ctx.json({ success: true });
});
