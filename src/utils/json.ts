import type { Json } from '../types/index.js';
import { orNull } from './promise.js';

export async function parseJsonObject<K extends string>(
    text: string,
): Promise<Partial<Record<K, Json>>> {
    const value = await orNull(
        Promise.try(() => JSON.parse<Partial<Record<K, Json>>>(text)),
    );
    return typeof value == 'object' && value && !Array.isArray(value)
        ? value
        : {};
}

export function isStringArray(value: Json | undefined) {
    return (
        Array.isArray(value) && value.every((item) => typeof item == 'string')
    );
}

export function toText(value: Json | undefined) {
    return typeof value == 'string' && value.trim() ? value : null;
}
