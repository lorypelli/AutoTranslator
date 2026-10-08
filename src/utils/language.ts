import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandAutocompleteResponse,
    InteractionResponseType,
} from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../types/index.js';
import { getLanguageName } from './ai.js';
import { getFocusedString } from './interaction.js';
import { orNull } from './promise.js';

const AUTOCOMPLETE_TIMEOUT_MS = 2500;
const MAX_CHOICE_LENGTH = 100;

export const MAX_LANGUAGE_LENGTH = 32;

export async function getPreferredLanguage(
    env: Bindings,
    userId: string | null,
) {
    return userId ? orNull(env.LANGUAGES.get(userId)) : null;
}

export async function autocompleteLanguage(
    interaction: APIApplicationCommandAutocompleteInteraction,
    { env }: Runtime,
): Promise<APIApplicationCommandAutocompleteResponse> {
    const input = getFocusedString(interaction)?.trim();
    const language = input
        ? await orNull(getLanguageName(env, input, AUTOCOMPLETE_TIMEOUT_MS))
        : null;
    const name = language && language.slice(0, MAX_CHOICE_LENGTH);
    return {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: { choices: name ? [{ name, value: name }] : [] },
    };
}
