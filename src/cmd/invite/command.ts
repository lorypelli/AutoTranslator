import { ApplicationCommandType } from 'discord-api-types/v10';
import { ANYWHERE, embedResponse, getInviteUrl } from '../../discord/index.js';
import type { Command } from '../../types/index.js';

export const INVITE_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'invite',
        description: 'Get the link to add the bot',
    },
    run(interaction, { env }) {
        return embedResponse(
            interaction,
            `[Add the bot](${getInviteUrl(env)})`,
        );
    },
};
