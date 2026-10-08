import {
    type APIInteraction,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { getLanguageName, withTimeout } from '../../ai/index.js';
import {
    error,
    getStringOption,
    getUserId,
    sendEmbeds,
    toEmbed,
} from '../../discord/index.js';
import { setPreferredLanguage } from '../../storage/index.js';
import type { Bindings, Subcommand } from '../../types/index.js';
import { MAX_LANGUAGE_LENGTH } from '../shared/index.js';
import { UNKNOWN_USER_ERROR } from './constants.js';

async function setLanguage(
    interaction: APIInteraction,
    env: Bindings,
    userId: string,
    language: string,
) {
    const name = await withTimeout(getLanguageName(env, language));
    await setPreferredLanguage(env, userId, name);
    await sendEmbeds(interaction, [
        toEmbed(`Your preferred language is now ${name}.`),
    ]);
}

export const LANGUAGE_SET_SUBCOMMAND: Subcommand = {
    data: {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'set',
        description: 'Set the language used when you do not choose one',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'language',
                description: 'Your preferred language',
                max_length: MAX_LANGUAGE_LENGTH,
                autocomplete: true,
                required: true,
            },
        ],
    },
    run(interaction, { env, defer }) {
        const userId = getUserId(interaction);
        if (!userId) {
            return error(UNKNOWN_USER_ERROR);
        }
        const language = getStringOption(interaction, 'language') || '';
        return defer(setLanguage(interaction, env, userId, language));
    },
};
