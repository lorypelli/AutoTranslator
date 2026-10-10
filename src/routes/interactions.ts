import { Hono } from 'hono';
import { handleInteraction } from '../cmd/index.js';
import { deferred, followUpOnError } from '../discord/index.js';
import { verifyDiscord } from '../middleware/index.js';
import type { DiscordEnv } from '../types/index.js';
import { getBindings } from '../utils/index.js';

export const interactions = new Hono<DiscordEnv>();

interactions.post('/', verifyDiscord, async (ctx) => {
    const interaction = ctx.get('interaction');
    const response = await handleInteraction(interaction, {
        env: getBindings(ctx),
        defer(work) {
            ctx.executionCtx.waitUntil(followUpOnError(interaction, work));
            return deferred();
        },
    });
    return ctx.json(response);
});
