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
    return res.json<APIMessage>();
}

export async function getMessages(
    env: Bindings,
    channelId: string,
    query: URLSearchParams,
) {
    const res = await botRequest(
        env,
        `${Routes.channelMessages(channelId)}?${query}`,
        'Could not fetch the messages.',
    );
    return res.json<APIMessage[]>();
}
