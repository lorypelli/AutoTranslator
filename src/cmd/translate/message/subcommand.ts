import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Subcommand } from '../../../types/index.js';
import {
    getBooleanOption,
    getMessageId,
    getStringOption,
    MAX_LANGUAGE_LENGTH,
} from '../../../utils/index.js';
import { EPHEMERAL_DESCRIPTION, LANGUAGE_DESCRIPTION } from './constants.js';
import { sendTranslation, translateMessage } from './translate.js';

export const TRANSLATE_MESSAGE_SUBCOMMAND: Subcommand = {
    data: {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'message',
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
                autocomplete: true,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'ephemeral',
                description: `${EPHEMERAL_DESCRIPTION} (default: true)`,
            },
        ],
    },
    run(interaction, runtime) {
        const text = getStringOption(interaction, 'message') || '';
        const messageId = getMessageId(text);
        const options = {
            language:
                getStringOption(interaction, 'language') || interaction.locale,
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
