export function getMessageId(text: string) {
    const id =
        URL.parse(text)?.pathname.match(
            /^\/channels\/[^/]+\/[^/]+\/(\d+)\/?$/,
        )?.[1] ?? text;
    return /^\d+$/.test(id) ? id : undefined;
}
