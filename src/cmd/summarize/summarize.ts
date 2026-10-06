import type { APIInteraction } from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../types/index.js';
import {
    error,
    getMessages,
    sendEmbeds,
    summarizeLatestConversation,
    toEmbed,
} from '../../utils/index.js';
import { MAX_MESSAGES } from './constants.js';

type SummarizeOptions = {
    language: string;
    ephemeral: boolean;
};

async function sendSummary(
    interaction: APIInteraction,
    env: Bindings,
    channelId: string,
    { language, ephemeral }: SummarizeOptions,
) {
    const fetched = await getMessages(env, channelId, {
        limit: `${MAX_MESSAGES}`,
    });
    const messages = fetched
        .filter((message) => !message.author.bot && message.content)
        .map((message) => ({
            author: message.author.global_name ?? message.author.username,
            content: message.content,
        }));
    if (!messages.length) {
        throw new Error('There are no messages to summarize.');
    }
    const summary = await summarizeLatestConversation(env, messages, language);
    await sendEmbeds(
        interaction,
        [
            {
                ...toEmbed(summary),
                footer: { text: 'Summary of the latest conversation' },
            },
        ],
        ephemeral,
    );
}

export function summarize(
    interaction: APIInteraction,
    { env, defer }: Runtime,
    options: SummarizeOptions,
) {
    const channelId = interaction.channel?.id;
    if (!channelId) {
        return error('This can only be used in a channel.');
    }
    return defer(sendSummary(interaction, env, channelId, options));
}
