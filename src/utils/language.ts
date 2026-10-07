import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandAutocompleteResponse,
    InteractionResponseType,
} from 'discord-api-types/v10';
import type { Runtime } from '../types/index.js';
import { getLanguageName } from './ai.js';
import { getFocusedString } from './interaction.js';

const AUTOCOMPLETE_TIMEOUT_MS = 2500;
const MAX_CHOICE_LENGTH = 100;

export const MAX_LANGUAGE_LENGTH = 32;

export async function autocompleteLanguage(
    interaction: APIApplicationCommandAutocompleteInteraction,
    { env }: Runtime,
): Promise<APIApplicationCommandAutocompleteResponse> {
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
}
