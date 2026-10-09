import { getPreferredLanguage } from '../../storage/index.js';
import type { Bindings } from '../../types/index.js';

export async function resolveLanguage(
    env: Bindings,
    language: string | null,
    userId: string | null,
    fallback: string,
) {
    if (language) {
        return language;
    }
    const preferred = await getPreferredLanguage(env, userId);
    return preferred || fallback;
}
