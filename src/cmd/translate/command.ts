import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    InteractionResponseType,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import {
    getBooleanOption,
    getFocusedString,
    getLanguageName,
    getMessageId,
    getStringOption,
} from '../../utils/index.js';
import {
    AUTOCOMPLETE_TIMEOUT_MS,
    EPHEMERAL_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    MAX_CHOICE_LENGTH,
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
                autocomplete: true,
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'ephemeral',
                description: `${EPHEMERAL_DESCRIPTION} (default: true)`,
            },
        ],
    },
    async autocomplete(interaction, { env }) {
        const input = getFocusedString(interaction)?.trim();
        const name = input
            ? await getLanguageName(env, input, AUTOCOMPLETE_TIMEOUT_MS).then(
                  (language) => language.slice(0, MAX_CHOICE_LENGTH),
                  () => undefined,
              )
            : undefined;
        return {
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: { choices: name ? [{ name, value: name }] : [] },
        };
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
