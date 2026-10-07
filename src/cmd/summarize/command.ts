import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import {
    autocompleteLanguage,
    FROM_DESCRIPTION,
    getBooleanOption,
    getStringOption,
    MAX_LANGUAGE_LENGTH,
    TO_DESCRIPTION,
} from '../../utils/index.js';
import { EPHEMERAL_DESCRIPTION, LANGUAGE_DESCRIPTION } from './constants.js';
import { summarize } from './summarize.js';

export const SUMMARIZE_COMMAND: Command = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: 'summarize',
        description: 'Summarize a conversation in this channel',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'language',
                description: LANGUAGE_DESCRIPTION,
                max_length: MAX_LANGUAGE_LENGTH,
                autocomplete: true,
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
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'ephemeral',
                description: `${EPHEMERAL_DESCRIPTION} (default: true)`,
            },
        ],
    },
    autocomplete: autocompleteLanguage,
    run(interaction, runtime) {
        return summarize(interaction, runtime, {
            language:
                getStringOption(interaction, 'language') || interaction.locale,
            ephemeral: getBooleanOption(interaction, 'ephemeral') ?? true,
            from: getStringOption(interaction, 'from'),
            to: getStringOption(interaction, 'to'),
        });
    },
};
