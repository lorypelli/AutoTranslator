import type { Bindings } from '../types/index.js';
import { orNull } from '../utils/index.js';

export async function getPreferredLanguage(
    env: Bindings,
    userId: string | null,
) {
    return userId ? orNull(env.LANGUAGES.get(userId)) : null;
}

export async function setPreferredLanguage(
    env: Bindings,
    userId: string,
    language: string,
) {
    await env.LANGUAGES.put(userId, language);
}

export async function deletePreferredLanguage(env: Bindings, userId: string) {
    await env.LANGUAGES.delete(userId);
}
