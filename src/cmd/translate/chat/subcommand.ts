import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Subcommand } from '../../../types/index.js';
import {
    FROM_DESCRIPTION,
    getIntegerOption,
    getStringOption,
    getUserOption,
    MAX_LANGUAGE_LENGTH,
    MAX_MESSAGES,
    TO_DESCRIPTION,
} from '../../../utils/index.js';
import {
    CONTEXT_MESSAGES,
    CUSTOM_MESSAGE_DESCRIPTION,
    DEFAULT_MESSAGES,
    LANGUAGE_DESCRIPTION,
    MAX_CUSTOM_MESSAGE_LENGTH,
    MESSAGES_DESCRIPTION,
} from './constants.js';
import { translate } from './translate.js';

export const TRANSLATE_CHAT_SUBCOMMAND: Subcommand = {
    data: {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'chat',
        description: 'Translate the chat for a user',
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
                type: ApplicationCommandOptionType.String,
                name: 'language',
                description: LANGUAGE_DESCRIPTION,
                max_length: MAX_LANGUAGE_LENGTH,
                autocomplete: true,
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
            language: getStringOption(interaction, 'language'),
            messages:
                getIntegerOption(interaction, 'messages') ?? DEFAULT_MESSAGES,
            from: getStringOption(interaction, 'from'),
            to: getStringOption(interaction, 'to'),
        });
    },
};
