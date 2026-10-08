import { setTimeout } from 'node:timers/promises';

export function orNull<T>(promise: Promise<T>) {
    return promise.then(
        (value) => value,
        () => null,
    );
}

export function orNullWithin<T>(promise: Promise<T>, ms: number) {
    return Promise.race([orNull(promise), setTimeout(ms, null)]);
}
