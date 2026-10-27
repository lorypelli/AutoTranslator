import type { APIMessage } from 'discord-api-types/v10';
import { getDisplayName } from '../discord/index.js';
import type { Bindings } from '../types/index.js';
import { toText } from '../utils/index.js';
import { ask } from './client.js';
import { INVALID_RESPONSE_ERROR } from './errors.js';
import { summaryPrompt } from './prompts.js';

export async function summarizeMessages(
    env: Bindings,
    messages: APIMessage[],
    language: string,
) {
    const { summary } = await ask<'summary'>(env, summaryPrompt(language), {
        messages: messages.map(({ author, content }) => ({
            author: getDisplayName(author),
            content,
        })),
    });
    const text = toText(summary);
    if (!text) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return text;
}
