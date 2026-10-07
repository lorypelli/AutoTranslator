import type { APIInteraction } from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../types/index.js';
import {
    type ChatMessage,
    error,
    getChatMessages,
    getMessageId,
    sendEmbeds,
    summarizeLatestConversation,
    summarizeMessages,
    toEmbed,
} from '../../utils/index.js';

type SummarizeOptions = {
    language: string;
    ephemeral: boolean;
    from?: string;
    to?: string;
};

function summarizeContents(
    env: Bindings,
    messages: ChatMessage[],
    { language, from, to }: SummarizeOptions,
) {
    if (from || to) {
        return summarizeMessages(env, messages, language);
    }
    return summarizeLatestConversation(env, messages, language);
}

async function sendSummary(
    interaction: APIInteraction,
    env: Bindings,
    channelId: string,
    options: SummarizeOptions,
) {
    const { ephemeral, from, to } = options;
    const fetched = await getChatMessages(env, channelId, { from, to });
    const messages = fetched.map((message) => ({
        author: message.author.global_name ?? message.author.username,
        content: message.content,
    }));
    if (!messages.length) {
        throw new Error('There are no messages to summarize.');
    }
    const { summary, count } = await summarizeContents(env, messages, options);
    await sendEmbeds(
        interaction,
        [
            {
                ...toEmbed(summary),
                footer: {
                    text: `Summarized ${count} ${count == 1 ? 'message' : 'messages'}`,
                },
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
    const from = options.from && getMessageId(options.from);
    const to = options.to && getMessageId(options.to);
    if (!channelId) {
        return error('This can only be used in a channel.');
    }
    if ((options.from && !from) || (options.to && !to)) {
        return error('From and to must be message IDs or links.');
    }
    return defer(
        sendSummary(interaction, env, channelId, { ...options, from, to }),
    );
}
