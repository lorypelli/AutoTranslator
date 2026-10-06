import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { handleInteraction } from '../cmd/index.js';
import { verifyDiscord } from '../middleware/index.js';
import type { Bindings, DiscordEnv } from '../types/index.js';
import { followUpError } from '../utils/index.js';

export const interactions = new Hono<DiscordEnv>();

interactions.post('/', verifyDiscord, async (ctx) => {
    const interaction = ctx.get('interaction');
    const response = await handleInteraction(interaction, {
        env: env<Bindings>(ctx),
        defer: (work) => {
            ctx.executionCtx.waitUntil(
                work.then(
                    () => {},
                    (err: Error) => followUpError(interaction, err.message),
                ),
            );
            return {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: { flags: MessageFlags.Ephemeral },
            };
        },
    });
    return ctx.json(response);
});
