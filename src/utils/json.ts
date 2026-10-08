import { orNull } from './promise.js';

export async function parseJsonObject(text: string) {
    const value = await orNull(Promise.try(() => JSON.parse(text)));
    return typeof value == 'object' && value && !Array.isArray(value)
        ? value
        : {};
}
