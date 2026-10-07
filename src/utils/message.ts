import type { Bindings } from '../types/index.js';
import { getMessages } from './api.js';

export const MAX_MESSAGES = 100;
export const FROM_DESCRIPTION =
    'The ID or link of the first message (without to, the AI finds where the conversation ends)';
export const TO_DESCRIPTION =
    'The ID or link of the last message (without from, the AI finds where the conversation starts)';

type MessageRange = {
    from?: string;
    to?: string;
    limit?: number;
};

export function getMessageId(text: string) {
    const id =
        URL.parse(text)?.pathname.match(
            /^\/channels\/[^/]+\/[^/]+\/(\d+)\/?$/,
        )?.[1] ?? text;
    return /^\d{17,20}$/.test(id) ? id : undefined;
}

function getQuery({
    from,
    to,
    limit = MAX_MESSAGES,
}: MessageRange): Record<string, string> {
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
) {
    const messages = await getMessages(env, channelId, getQuery(range));
    return messages.filter(
        (message) =>
            !message.author.bot &&
            message.content &&
            (!range.to || BigInt(message.id) <= BigInt(range.to)),
    );
}
