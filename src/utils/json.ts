import type { Json } from '../types/index.js';
import { orNull } from './promise.js';

export async function parseJsonObject(text: string) {
    const value = await orNull(Promise.try(() => JSON.parse(text)));
    return typeof value == 'object' && value && !Array.isArray(value)
        ? value
        : {};
}

export function isStringArray(value: Json | undefined) {
    return (
        Array.isArray(value) && value.every((item) => typeof item == 'string')
    );
}
