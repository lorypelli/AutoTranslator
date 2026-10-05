import type { JsonObject } from '../types/index.js';

export function parseJsonObject(text: string): Promise<JsonObject> {
    return Promise.try(() => JSON.parse(text)).then(
        (value) =>
            typeof value == 'object' && value && !Array.isArray(value)
                ? value
                : {},
        () => ({}),
    );
}
