import {
    type APIInteraction,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { Bindings, Subcommand } from '../../types/index.js';
import {
    editOriginal,
    error,
    getLanguageName,
    getStringOption,
    getUserId,
    MAX_LANGUAGE_LENGTH,
    toEmbed,
} from '../../utils/index.js';

async function setLanguage(
    interaction: APIInteraction,
    env: Bindings,
    userId: string,
    language: string,
) {
    const name = await getLanguageName(env, language);
    await env.LANGUAGES.put(userId, name);
    await editOriginal(interaction, {
        embeds: [toEmbed(`Your preferred language is now ${name}.`)],
    });
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
            return error('Could not find your user.');
        }
        return defer(
            setLanguage(
                interaction,
                env,
                userId,
                getStringOption(interaction, 'language') || '',
            ),
        );
    },
};
