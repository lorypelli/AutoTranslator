import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import { getBooleanOption, getStringOption } from '../../utils/index.js';
import {
    EPHEMERAL_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    MAX_LANGUAGE_LENGTH,
} from './constants.js';
import { sendTranslation } from './translate.js';

export const TRANSLATE_COMMAND: Command = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: 'translate',
        description: 'Translate a message into another language',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'message',
                description: 'The message to translate',
                required: true,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'language',
                description: LANGUAGE_DESCRIPTION,
                max_length: MAX_LANGUAGE_LENGTH,
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'ephemeral',
                description: EPHEMERAL_DESCRIPTION,
            },
        ],
    },
    run(interaction, { env, defer }) {
        return defer(
            sendTranslation(interaction, env, {
                text: getStringOption(interaction, 'message') || '',
                language: getStringOption(interaction, 'language') || '',
                ephemeral: getBooleanOption(interaction, 'ephemeral') ?? true,
            }),
        );
    },
};
