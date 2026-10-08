import {
    type APIInteraction,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { error, getUserId, sendEmbeds, toEmbed } from '../../discord/index.js';
import { deletePreferredLanguage } from '../../storage/index.js';
import type { Bindings, Subcommand } from '../../types/index.js';
import { UNKNOWN_USER_ERROR } from './constants.js';

async function resetLanguage(
    interaction: APIInteraction,
    env: Bindings,
    userId: string,
) {
    await deletePreferredLanguage(env, userId);
    await sendEmbeds(interaction, [
        toEmbed('Your preferred language was removed.'),
    ]);
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
            return error(UNKNOWN_USER_ERROR);
        }
        return defer(resetLanguage(interaction, env, userId));
    },
};
