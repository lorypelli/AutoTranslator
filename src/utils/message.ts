export function getMessageId(text: string) {
    const path = URL.parse(text)?.pathname.split('/');
    const id = path?.[1] == 'channels' ? path[4] : text;
    return id && [...id].every((char) => char >= '0' && char <= '9')
        ? id
        : undefined;
}
