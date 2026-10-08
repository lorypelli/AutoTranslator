import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { handleInteraction } from '../cmd/index.js';
import { deferred, followUpOnError } from '../discord/index.js';
import { verifyDiscord } from '../middleware/index.js';
import type { Bindings, DiscordEnv } from '../types/index.js';

export const interactions = new Hono<DiscordEnv>();

interactions.post('/', verifyDiscord, async (ctx) => {
    const interaction = ctx.get('interaction');
    const response = await handleInteraction(interaction, {
        env: env<Bindings>(ctx),
        defer(work) {
            ctx.executionCtx.waitUntil(followUpOnError(interaction, work));
            return deferred();
        },
    });
    return ctx.json(response);
});
