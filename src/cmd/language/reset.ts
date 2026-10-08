import {
    type APIInteraction,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { Bindings, Subcommand } from '../../types/index.js';
import { editOriginal, error, getUserId, toEmbed } from '../../utils/index.js';

async function resetLanguage(
    interaction: APIInteraction,
    env: Bindings,
    userId: string,
) {
    await env.LANGUAGES.delete(userId);
    await editOriginal(interaction, {
        embeds: [toEmbed('Your preferred language was removed.')],
    });
}

export const LANGUAGE_RESET_SUBCOMMAND: Subcommand = {
    data: {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'reset',
        description: 'Remove your preferred language',
    },
    run(interaction, { env, defer }) {
        const userId = getUserId(interaction);
        if (!userId) {
            return error('Could not find your user.');
        }
        return defer(resetLanguage(interaction, env, userId));
    },
};
