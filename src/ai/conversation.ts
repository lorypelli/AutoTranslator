import type { APIMessage } from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';
import { ask } from './client.js';
import { INVALID_RESPONSE_ERROR } from './errors.js';
import {
    FIRST_CONVERSATION_PROMPT,
    LATEST_CONVERSATION_PROMPT,
} from './prompts.js';

async function findBoundary(
    env: Bindings,
    prompt: string,
    key: string,
    messages: APIMessage[],
) {
    const reply = await ask(env, prompt, {
        messages: messages.map((message, id) => ({
            id,
            content: message.content,
        })),
    });
    const index = reply[key];
    if (
        typeof index != 'number' ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= messages.length
    ) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return index;
}

export async function getLatestConversation(
    env: Bindings,
    messages: APIMessage[],
) {
    const start = await findBoundary(
        env,
        LATEST_CONVERSATION_PROMPT,
        'start',
        messages,
    );
    return messages.slice(start);
}

export async function getFirstConversation(
    env: Bindings,
    messages: APIMessage[],
) {
    const end = await findBoundary(
        env,
        FIRST_CONVERSATION_PROMPT,
        'end',
        messages,
    );
    return messages.slice(0, end + 1);
}
