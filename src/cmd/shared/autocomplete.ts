import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import { getLanguageName } from '../../ai/index.js';
import { autocompleteChoices, getFocusedString } from '../../discord/index.js';
import type { Runtime } from '../../types/index.js';
import { orNullWithin } from '../../utils/index.js';

const AUTOCOMPLETE_TIMEOUT_MS = 2500;
const MAX_CHOICE_LENGTH = 100;

export async function autocompleteLanguage(
    interaction: APIApplicationCommandAutocompleteInteraction,
    { env }: Runtime,
) {
    const input = getFocusedString(interaction)?.trim();
    if (!input) {
        return autocompleteChoices([]);
    }
    const language = await orNullWithin(
        getLanguageName(env, input),
        AUTOCOMPLETE_TIMEOUT_MS,
    );
    if (!language) {
        return autocompleteChoices([]);
    }
    return autocompleteChoices([language.slice(0, MAX_CHOICE_LENGTH)]);
}
