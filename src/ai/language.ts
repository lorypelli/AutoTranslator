import type { Bindings } from '../types/index.js';
import { isStringArray, orNull, toText } from '../utils/index.js';
import { ask } from './client.js';
import { INVALID_LANGUAGE_ERROR, INVALID_RESPONSE_ERROR } from './errors.js';
import {
    DETECT_LANGUAGE_PROMPT,
    LANGUAGE_NAME_PROMPT,
    RANDOM_LANGUAGES_PROMPT,
    SUGGEST_LANGUAGES_PROMPT,
} from './prompts.js';

export async function getLanguageName(env: Bindings, input: string) {
    const { kind, language } = await ask<'kind' | 'language'>(
        env,
        LANGUAGE_NAME_PROMPT,
        {
            input,
        },
    );
    if (kind == 'other') {
        throw new Error(INVALID_LANGUAGE_ERROR);
    }
    const name = toText(language);
    if (!name) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return name;
}

export async function getLanguageSuggestions(env: Bindings, input: string) {
    const { languages } = await ask<'languages'>(
        env,
        SUGGEST_LANGUAGES_PROMPT,
        {
            language: input,
        },
    );
    if (!isStringArray(languages)) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    const checks = await Promise.all(
        languages.map((name) => orNull(getLanguageName(env, name))),
    );
    return languages.filter((_, i) => checks.at(i));
}

export async function getRandomLanguages(env: Bindings) {
    const { languages } = await ask<'languages'>(
        env,
        RANDOM_LANGUAGES_PROMPT,
        {},
    );
    if (!isStringArray(languages)) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return languages;
}

export async function detectLanguage(env: Bindings, text: string) {
    const { language } = await ask<'language'>(env, DETECT_LANGUAGE_PROMPT, {
        text,
    });
    const name = toText(language);
    if (!name) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return name;
}
