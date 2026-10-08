import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import {
    getBooleanOption,
    getStringOption,
    parseMessageId,
} from '../../../discord/index.js';
import type { Subcommand } from '../../../types/index.js';
import { MAX_LANGUAGE_LENGTH } from '../../shared/index.js';
import { EPHEMERAL_DESCRIPTION, LANGUAGE_DESCRIPTION } from './constants.js';
import { translateFromId, translateFromText } from './translate.js';

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
        const messageId = parseMessageId(text);
        const options = {
            language: getStringOption(interaction, 'language'),
            ephemeral: getBooleanOption(interaction, 'ephemeral') ?? true,
        };
        if (messageId) {
            return translateFromId(interaction, runtime, messageId, options);
        }
        return translateFromText(interaction, runtime, text, options);
    },
};
