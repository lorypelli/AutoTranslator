import type { Bindings } from '../types/index.js';
import { getMessages } from './api.js';

const MESSAGE_PATH_REGEX = /^\/channels\/[^/]+\/[^/]+\/(\d+)\/?$/;
const SNOWFLAKE_REGEX = /^\d{17,20}$/;

export const MAX_MESSAGES = 100;
export const FROM_DESCRIPTION =
    'The ID or link of the first message (without to, the AI finds where the conversation ends)';
export const TO_DESCRIPTION =
    'The ID or link of the last message (without from, the AI finds where the conversation starts)';

type MessageRange = {
    from: string | null;
    to: string | null;
    limit?: number;
};

export function getMessageId(text: string) {
    const id = URL.parse(text)?.pathname.match(MESSAGE_PATH_REGEX)?.[1] ?? text;
    return SNOWFLAKE_REGEX.test(id) ? id : null;
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
