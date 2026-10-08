import type { Bindings } from '../types/index.js';
import { getMessages } from './channel.js';

const MESSAGE_PATH_REGEX = /^\/channels\/[^/]+\/[^/]+\/(?<id>\d+)\/?$/;
const SNOWFLAKE_REGEX = /^\d{17,20}$/;

export const MAX_MESSAGES = 100;

type MessageRange = {
    from: string | null;
    to: string | null;
};

export function parseMessageId(text: string) {
    const match = URL.parse(text)?.pathname.match(MESSAGE_PATH_REGEX);
    const id = match?.groups?.id ?? text;
    return SNOWFLAKE_REGEX.test(id) ? id : null;
}

export function parseMessageRange(from: string | null, to: string | null) {
    const fromId = from && parseMessageId(from);
    const toId = to && parseMessageId(to);
    if ((from && !fromId) || (to && !toId)) {
        return null;
    }
    return { from: fromId, to: toId };
}

function getQuery(
    { from, to }: MessageRange,
    limit: number,
): Record<string, string> {
    if (from) {
        return { after: `${BigInt(from) - 1n}`, limit: `${MAX_MESSAGES}` };
    }
    if (to) {
        return { before: `${BigInt(to) + 1n}`, limit: `${MAX_MESSAGES}` };
    }
    return { limit: `${limit}` };
}

export async function getChatMessages(
    env: Bindings,
    channelId: string,
    range: MessageRange,
    limit = MAX_MESSAGES,
) {
    const messages = await getMessages(env, channelId, getQuery(range, limit));
    return messages.filter(
        (message) =>
            !message.author.bot &&
            message.content &&
            (!range.to || BigInt(message.id) <= BigInt(range.to)),
    );
}
