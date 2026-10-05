import type { APIInteraction } from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../types/index.js';
import {
    chunkEmbeds,
    deleteOriginal,
    error,
    followUp,
    getMessageId,
    getMessages,
    toEmbed,
    translateFirstConversation,
    translateLatestConversation,
    translateMessages,
} from '../../utils/index.js';
import { CONTEXT_MESSAGES, MAX_MESSAGES, MIN_MESSAGES } from './constants.js';

type TranslateOptions = {
    userId: string;
    customMessage: string;
    messages: number;
    from?: string;
    to?: string;
};

function getQuery({
    messages,
    from,
    to,
}: TranslateOptions): Record<string, string> {
    if (from) {
        return { after: `${BigInt(from) - 1n}`, limit: `${MAX_MESSAGES}` };
    }
    if (to) {
        return { before: `${BigInt(to) + 1n}`, limit: `${MAX_MESSAGES}` };
    }
    return {
        limit: `${messages == CONTEXT_MESSAGES ? MAX_MESSAGES : messages}`,
    };
}

function translateContents(
    env: Bindings,
    contents: string[],
    { messages, from, to }: TranslateOptions,
) {
    if (from && to) {
        return translateMessages(env, contents, 'English');
    }
    if (from) {
        return translateFirstConversation(env, contents, 'English');
    }
    if (to || messages == CONTEXT_MESSAGES) {
        return translateLatestConversation(env, contents, 'English');
    }
    return translateMessages(env, contents, 'English');
}

async function sendTranslations(
    interaction: APIInteraction,
    env: Bindings,
    channelId: string,
    options: TranslateOptions,
) {
    const { userId, customMessage, from, to } = options;
    const fetched = await getMessages(env, channelId, getQuery(options));
    const recent = fetched.filter(
        (message) =>
            !message.author.bot &&
            message.content &&
            (!to || BigInt(message.id) <= BigInt(to)),
    );
    if (!recent.length) {
        throw new Error('There are no messages to translate.');
    }
    const translations = await translateContents(
        env,
        recent.map((message) => message.content),
        options,
    );
    const translated = from
        ? recent.slice(0, translations.length)
        : recent.slice(-translations.length);
    const chunks = chunkEmbeds(
        translated.map((message, i) => toEmbed(translations[i], message)),
    );
    await deleteOriginal(interaction);
    await chunks.reduce(
        (previous, embeds, i) =>
            previous.then(() =>
                followUp(interaction, {
                    content:
                        i == 0 ? `<@${userId}> ${customMessage}` : undefined,
                    embeds,
                    allowed_mentions: { users: [userId] },
                }),
            ),
        Promise.resolve(),
    );
}

export function translate(
    interaction: APIInteraction,
    { env, defer }: Runtime,
    options: TranslateOptions,
) {
    const channelId = interaction.channel?.id;
    const { messages } = options;
    const from = options.from && getMessageId(options.from);
    const to = options.to && getMessageId(options.to);
    if (!channelId) {
        return error('This can only be used in a channel.');
    }
    if (
        messages != CONTEXT_MESSAGES &&
        (!Number.isInteger(messages) ||
            messages < MIN_MESSAGES ||
            messages > MAX_MESSAGES)
    ) {
        return error(
            `Messages must be ${CONTEXT_MESSAGES}, or an integer between ${MIN_MESSAGES} and ${MAX_MESSAGES}.`,
        );
    }
    if ((options.from && !from) || (options.to && !to)) {
        return error('From and to must be message IDs or links.');
    }
    return defer(
        sendTranslations(interaction, env, channelId, {
            ...options,
            from,
            to,
        }),
    );
}
