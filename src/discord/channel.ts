import { type APIMessage, Routes } from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';
import { botRequest } from './rest.js';

export async function getMessage(
    env: Bindings,
    channelId: string,
    messageId: string,
) {
    const res = await botRequest(
        env,
        Routes.channelMessage(channelId, messageId),
        'Could not fetch the message.',
    );
    const message: APIMessage = await res.json();
    return message;
}

export async function getMessages(
    env: Bindings,
    channelId: string,
    query: Record<string, string>,
) {
    const res = await botRequest(
        env,
        `${Routes.channelMessages(channelId)}?${new URLSearchParams(query)}`,
        'Could not fetch the messages.',
    );
    const messages: APIMessage[] = await res.json();
    return messages.reverse();
}
