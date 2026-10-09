import { ApplicationCommandType } from 'discord-api-types/v10';
import { ANYWHERE } from '../../discord/index.js';
import type { Command } from '../../types/index.js';
import { autocompleteLanguage, runSubcommand } from '../shared/index.js';
import { TRANSLATE_CHAT_SUBCOMMAND } from './chat/index.js';
import { TRANSLATE_MESSAGE_SUBCOMMAND } from './message/index.js';

const SUBCOMMANDS = [TRANSLATE_CHAT_SUBCOMMAND, TRANSLATE_MESSAGE_SUBCOMMAND];

export const TRANSLATE_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'translate',
        description: 'Translate a message or the chat',
        options: SUBCOMMANDS.map((subcommand) => subcommand.data),
    },
    autocomplete: autocompleteLanguage,
    run(interaction, runtime) {
        return runSubcommand(interaction, runtime, SUBCOMMANDS);
    },
};
