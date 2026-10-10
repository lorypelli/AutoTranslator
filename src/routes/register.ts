import { Hono } from 'hono';
import { COMMANDS } from '../cmd/index.js';
import { registerCommands } from '../discord/index.js';
import { authBot } from '../middleware/index.js';
import { getBindings } from '../utils/index.js';

export const register = new Hono();

register.post('/', authBot, async (ctx) => {
    await registerCommands(
        getBindings(ctx),
        COMMANDS.map((command) => command.data),
    );
    return ctx.json({ success: true });
});
