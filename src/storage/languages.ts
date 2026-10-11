import type { Bindings } from '../types/index.js';
import { orNull } from '../utils/index.js';

export async function getPreferredLanguage(
    { LANGUAGES }: Bindings,
    userId: string | null,
) {
    return userId ? orNull(LANGUAGES.get(userId)) : null;
}

export async function setPreferredLanguage(
    { LANGUAGES }: Bindings,
    userId: string,
    language: string,
) {
    await LANGUAGES.put(userId, language);
}

export async function deletePreferredLanguage(
    { LANGUAGES }: Bindings,
    userId: string,
) {
    await LANGUAGES.delete(userId);
}
