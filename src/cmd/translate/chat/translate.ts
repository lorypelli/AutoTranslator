import type { APIInteraction, APIMessage } from 'discord-api-types/v10';
import {
    getFirstConversation,
    getLatestConversation,
    translateMessages,
    withTimeout,
} from '../../../ai/index.js';
import {
    chunkEmbeds,
    error,
    followUpPublicly,
    getChatMessages,
    getReadableChannelId,
    MAX_MESSAGES,
    parseMessageRange,
    toEmbed,
} from '../../../discord/index.js';
import type { Bindings, Runtime } from '../../../types/index.js';
import {
    INVALID_RANGE_ERROR,
    resolveLanguage,
    UNREADABLE_CHANNEL_ERROR,
} from '../../shared/index.js';
import {
    CONTEXT_MESSAGES,
    DEFAULT_LANGUAGE,
    MIN_MESSAGES,
} from './constants.js';

type TranslateChatOptions = {
    userId: string;
    customMessage: string;
    language: string | null;
    count: number;
    from: string | null;
    to: string | null;
};

function isValidCount(count: number) {
    if (count == CONTEXT_MESSAGES) {
        return true;
    }
    return (
        Number.isInteger(count) &&
        count >= MIN_MESSAGES &&
        count <= MAX_MESSAGES
    );
}

async function selectMessages(
    env: Bindings,
    messages: APIMessage[],
    { count, from, to }: TranslateChatOptions,
) {
    if (from && to) {
        return messages;
    }
    if (from) {
        return getFirstConversation(env, messages);
    }
    if (to || count == CONTEXT_MESSAGES) {
        return getLatestConversation(env, messages);
    }
    return messages;
}

async function translateToEmbeds(
    env: Bindings,
    messages: APIMessage[],
    language: string,
    options: TranslateChatOptions,
) {
    const selected = await selectMessages(env, messages, options);
    const translations = await translateMessages(
        env,
        selected.map((message) => message.content),
        language,
    );
    return translations.map((translation, i) =>
        toEmbed(translation, selected[i]),
    );
}

async function sendTranslations(
    interaction: APIInteraction,
    env: Bindings,
    channelId: string,
    options: TranslateChatOptions,
) {
    const { userId, customMessage, count, from, to } = options;
    const limit = count == CONTEXT_MESSAGES ? MAX_MESSAGES : count;
    const messages = await getChatMessages(env, channelId, { from, to }, limit);
    if (!messages.length) {
        throw new Error('There are no messages to translate.');
    }
    const language = await resolveLanguage(
        env,
        options.language,
        userId,
        DEFAULT_LANGUAGE,
    );
    const embeds = await withTimeout(
        translateToEmbeds(env, messages, language, options),
    );
    const bodies = chunkEmbeds(embeds).map((chunk, i) => ({
        content: i == 0 ? `<@${userId}> ${customMessage}` : undefined,
        embeds: chunk,
        allowed_mentions: { users: [userId] },
    }));
    await followUpPublicly(interaction, bodies);
}

export function translate(
    interaction: APIInteraction,
    { env, defer }: Runtime,
    options: TranslateChatOptions,
) {
    const channelId = getReadableChannelId(interaction);
    if (!channelId) {
        return error(UNREADABLE_CHANNEL_ERROR);
    }
    if (!isValidCount(options.count)) {
        return error(
            `Messages must be ${CONTEXT_MESSAGES}, or an integer between ${MIN_MESSAGES} and ${MAX_MESSAGES}.`,
        );
    }
    const range = parseMessageRange(options.from, options.to);
    if (!range) {
        return error(INVALID_RANGE_ERROR);
    }
    return defer(
        sendTranslations(interaction, env, channelId, { ...options, ...range }),
    );
}
