import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import {
    autocompleteLanguage,
    getBooleanOption,
    getStringOption,
    MAX_LANGUAGE_LENGTH,
} from '../../utils/index.js';
import { EPHEMERAL_DESCRIPTION, LANGUAGE_DESCRIPTION } from './constants.js';
import { summarize } from './summarize.js';

export const SUMMARIZE_COMMAND: Command = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: 'summarize',
        description: 'Summarize the latest conversation in this channel',
        options: [
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
    autocomplete: autocompleteLanguage,
    run(interaction, runtime) {
        return summarize(interaction, runtime, {
            language:
                getStringOption(interaction, 'language') || interaction.locale,
            ephemeral: getBooleanOption(interaction, 'ephemeral') ?? true,
        });
    },
};
