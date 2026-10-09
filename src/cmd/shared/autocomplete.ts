import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import { getLanguageSuggestions } from '../../ai/index.js';
import { autocompleteChoices, getFocusedString } from '../../discord/index.js';
import type { Runtime } from '../../types/index.js';
import { orNullWithin } from '../../utils/index.js';

const AUTOCOMPLETE_TIMEOUT_MS = 2500;
const MAX_CHOICES = 25;
const MAX_CHOICE_LENGTH = 100;

export async function autocompleteLanguage(
    interaction: APIApplicationCommandAutocompleteInteraction,
    { env }: Runtime,
) {
    const input = getFocusedString(interaction)?.trim();
    if (!input) {
        return autocompleteChoices([]);
    }
    const suggestions =
        (await orNullWithin(
            getLanguageSuggestions(env, input),
            AUTOCOMPLETE_TIMEOUT_MS,
        )) || [];
    const names = suggestions
        .filter((name) => name.trim())
        .map((name) => name.slice(0, MAX_CHOICE_LENGTH));
    return autocompleteChoices([...new Set(names)].slice(0, MAX_CHOICES));
}
