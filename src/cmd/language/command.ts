import { ApplicationCommandType } from 'discord-api-types/v10';
import { ANYWHERE } from '../../discord/index.js';
import type { Command } from '../../types/index.js';
import { autocompleteLanguage, runSubcommand } from '../shared/index.js';
import { LANGUAGE_RESET_SUBCOMMAND } from './reset.js';
import { LANGUAGE_SET_SUBCOMMAND } from './set.js';

const SUBCOMMANDS = [LANGUAGE_SET_SUBCOMMAND, LANGUAGE_RESET_SUBCOMMAND];

export const LANGUAGE_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'language',
        description: 'Set or remove your preferred language',
        options: SUBCOMMANDS.map((subcommand) => subcommand.data),
    },
    autocomplete: autocompleteLanguage,
    run(interaction, runtime) {
        return runSubcommand(SUBCOMMANDS, interaction, runtime);
    },
};
