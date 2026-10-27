import type {
    APIApplicationCommandInteraction,
    APIEmbed,
    APIMessage,
    APIUser,
} from 'discord-api-types/v10';
import {
    getLanguageName,
    getLatestConversation,
    summarizeMessages,
    withTimeout,
} from '../../ai/index.js';
import {
    error,
    getChatMessages,
    getReadableChannelId,
    getUser,
    getUserId,
    parseMessageRange,
    sendEmbeds,
    toEmbed,
} from '../../discord/index.js';
import type { Bindings, Runtime } from '../../types/index.js';
import {
    INVALID_RANGE_ERROR,
    resolveLanguage,
    UNREADABLE_CHANNEL_ERROR,
} from '../shared/index.js';

type SummarizeOptions = {
    language: string | null;
    ephemeral: boolean;
    from: string | null;
    to: string | null;
};

function getFooterText(count: number) {
    return `Summarized ${count} ${count == 1 ? 'message' : 'messages'}`;
}

async function selectMessages(
    env: Bindings,
    messages: APIMessage[],
    { from, to }: SummarizeOptions,
) {
    if (from || to) {
        return messages;
    }
    return getLatestConversation(env, messages);
}

async function summarizeToEmbed(
    env: Bindings,
    messages: APIMessage[],
    language: string,
    user: APIUser | null,
    options: SummarizeOptions,
): Promise<APIEmbed> {
    const [conversation, name] = await Promise.all([
        selectMessages(env, messages, options),
        getLanguageName(env, language),
    ]);
    const summary = await summarizeMessages(env, conversation, name);
    return {
        ...toEmbed(summary, user),
        footer: {
            text: getFooterText(conversation.length),
        },
    };
}

async function sendSummary(
    interaction: APIApplicationCommandInteraction,
    env: Bindings,
    channelId: string,
    options: SummarizeOptions,
) {
    const { ephemeral, from, to } = options;
    const messages = await getChatMessages(env, channelId, {
        from,
        to,
    });
    if (!messages.length) {
        throw new Error('There are no messages to summarize.');
    }
    const language = await resolveLanguage(
        env,
        options.language,
        getUserId(interaction),
        interaction.locale,
    );
    const embed = await withTimeout(
        summarizeToEmbed(
            env,
            messages,
            language,
            getUser(interaction),
            options,
        ),
    );
    await sendEmbeds(interaction, [embed], ephemeral);
}

export function summarize(
    interaction: APIApplicationCommandInteraction,
    { env, defer }: Runtime,
    options: SummarizeOptions,
) {
    const channelId = getReadableChannelId(interaction);
    if (!channelId) {
        return error(UNREADABLE_CHANNEL_ERROR);
    }
    const range = parseMessageRange(options.from, options.to);
    if (!range) {
        return error(INVALID_RANGE_ERROR);
    }
    return defer(
        sendSummary(interaction, env, channelId, {
            ...options,
            ...range,
        }),
    );
}
