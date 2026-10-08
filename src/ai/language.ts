import type { Bindings } from '../types/index.js';
import { ask } from './client.js';
import { INVALID_LANGUAGE_ERROR, INVALID_RESPONSE_ERROR } from './errors.js';
import { DETECT_LANGUAGE_PROMPT, LANGUAGE_NAME_PROMPT } from './prompts.js';

export async function getLanguageName(env: Bindings, input: string) {
    const { kind, language } = await ask(env, LANGUAGE_NAME_PROMPT, {
        language: input,
    });
    if (kind == 'other') {
        throw new Error(INVALID_LANGUAGE_ERROR);
    }
    if (typeof language != 'string' || !language.trim()) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return language;
}

export async function detectLanguage(env: Bindings, text: string) {
    const { language } = await ask(env, DETECT_LANGUAGE_PROMPT, { text });
    if (typeof language != 'string' || !language.trim()) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return language;
}
