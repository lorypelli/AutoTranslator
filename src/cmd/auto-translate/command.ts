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
    CUSTOM_MESSAGE_DESCRIPTION,
    MAX_MESSAGES,
    MESSAGES_DESCRIPTION,
    MIN_MESSAGES,
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
                type: ApplicationCommandOptionType.Integer,
                name: 'messages',
                description: MESSAGES_DESCRIPTION,
                min_value: MIN_MESSAGES,
                max_value: MAX_MESSAGES,
                required: true,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'custom-message',
                description: CUSTOM_MESSAGE_DESCRIPTION,
                required: true,
            },
        ],
    },
    run(interaction, runtime) {
        return translate(interaction, runtime, {
            userId: getUserOption(interaction, 'user') || '',
            messages: getIntegerOption(interaction, 'messages') || 0,
            customMessage: getStringOption(interaction, 'custom-message') || '',
        });
    },
};
