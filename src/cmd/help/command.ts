import { ApplicationCommandType } from 'discord-api-types/v10';
import { ANYWHERE, embedResponse } from '../../discord/index.js';
import type { Command } from '../../types/index.js';
import { HELP_TEXT } from './constants.js';

export const HELP_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'help',
        description: 'Show what the bot can do',
    },
    run(interaction) {
        return embedResponse(interaction, HELP_TEXT);
    },
};
