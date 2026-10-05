import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import {
    getBooleanOption,
    getMessageId,
    getStringOption,
} from '../../utils/index.js';
import {
    EPHEMERAL_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    MAX_LANGUAGE_LENGTH,
} from './constants.js';
import { sendTranslation, translateMessage } from './translate.js';

export const TRANSLATE_COMMAND: Command = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: 'translate',
        description: 'Translate a message into another language',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'message',
                description:
                    'The text to translate, or the ID or link of a message',
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
    run(interaction, runtime) {
        const text = getStringOption(interaction, 'message') || '';
        const messageId = getMessageId(text);
        const options = {
            language: getStringOption(interaction, 'language') || '',
            ephemeral: getBooleanOption(interaction, 'ephemeral') ?? true,
        };
        if (messageId) {
            return translateMessage(interaction, runtime, messageId, options);
        }
        return runtime.defer(
            sendTranslation(interaction, runtime.env, text, options),
        );
    },
};
