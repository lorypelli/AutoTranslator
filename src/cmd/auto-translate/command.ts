import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import {
    getIntegerOption,
    getStringOption,
    getUserOption,
} from '../../utils/index.js';
import {
    CONTEXT_MESSAGES,
    CUSTOM_MESSAGE_DESCRIPTION,
    DEFAULT_MESSAGES,
    FROM_DESCRIPTION,
    MAX_CUSTOM_MESSAGE_LENGTH,
    MAX_MESSAGES,
    MESSAGES_DESCRIPTION,
    TO_DESCRIPTION,
} from './constants.js';
import { translate } from './translate.js';

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
                type: ApplicationCommandOptionType.String,
                name: 'custom-message',
                description: CUSTOM_MESSAGE_DESCRIPTION,
                max_length: MAX_CUSTOM_MESSAGE_LENGTH,
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Integer,
                name: 'messages',
                description: MESSAGES_DESCRIPTION,
                min_value: CONTEXT_MESSAGES,
                max_value: MAX_MESSAGES,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'from',
                description: FROM_DESCRIPTION,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'to',
                description: TO_DESCRIPTION,
            },
        ],
    },
    run(interaction, runtime) {
        return translate(interaction, runtime, {
            userId: getUserOption(interaction, 'user') || '',
            customMessage: getStringOption(interaction, 'custom-message') || '',
            messages:
                getIntegerOption(interaction, 'messages') ?? DEFAULT_MESSAGES,
            from: getStringOption(interaction, 'from'),
            to: getStringOption(interaction, 'to'),
        });
    },
};
