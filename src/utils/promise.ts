export function orNull<T>(promise: Promise<T>) {
    return promise.then(
        (value) => value,
        () => null,
    );
}
