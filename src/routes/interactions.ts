import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
    InteractionResponseType,
    InteractionType,
    type APIInteractionResponse,
} from 'discord-api-types/v10';
import { COMMANDS, MODALS } from '../cmd/index.js';
import { verifyDiscord } from '../middleware/index.js';
import type { Defer, DiscordEnv } from '../types/index.js';

export const interactions = new Hono<DiscordEnv>();

interactions.post('/', verifyDiscord, (ctx) => {
    const interaction = ctx.get('interaction');
    const defer: Defer = (work) => {
        ctx.executionCtx.waitUntil(work);
        return {
            type: InteractionResponseType.DeferredChannelMessageWithSource,
        };
    };
    if (interaction.type == InteractionType.Ping) {
        return ctx.json<APIInteractionResponse>({
            type: InteractionResponseType.Pong,
        });
    }
    if (interaction.type == InteractionType.ApplicationCommand) {
        const command = COMMANDS.find(
            (cmd) => cmd.data.name == interaction.data.name,
        );
        if (command) {
            return ctx.json(command.run(interaction, defer));
        }
    }
    if (interaction.type == InteractionType.ModalSubmit) {
        const [id, ...args] = interaction.data.custom_id.split(':');
        const modal = MODALS.find((m) => m.id == id);
        if (modal) {
            return ctx.json(modal.run(interaction, defer, args));
        }
    }
    throw new HTTPException(400);
});
