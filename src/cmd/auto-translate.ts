import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import type { Command } from '../types/index.js';
import { followUp } from '../utils/index.js';

export const AUTO_TRANSLATE_COMMAND: Command = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: 'auto-translate',
        description: 'Automatically translate messages',
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: 'user',
                description: 'The user to translate messages for',
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Integer,
                name: 'messages',
                description:
                    'The number of messages to translate (use -1 to have AI understand the context)',
                min_value: -1,
                max_value: 100,
                required: true,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'custom-message',
                description: 'The custom message for the specified user',
                required: true,
            },
        ],
    },
    async run(interaction) {
        await followUp(interaction, { content: 'Command received!' });
    },
};

export const AUTO_TRANSLATE_SELECT_MENU: Command = {
    data: {
        type: ApplicationCommandType.Message,
        name: 'Auto Translate',
    },
    async run(interaction) {
        await followUp(interaction, { content: 'Command received!' });
    },
};
