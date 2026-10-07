import type { APIInteraction } from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../../types/index.js';
import {
    chunkEmbeds,
    deleteOriginal,
    error,
    followUp,
    getChatMessages,
    getMessageId,
    MAX_MESSAGES,
    toEmbed,
    translateFirstConversation,
    translateLatestConversation,
    translateMessages,
} from '../../../utils/index.js';
import { CONTEXT_MESSAGES, MIN_MESSAGES } from './constants.js';

type TranslateOptions = {
    userId: string;
    customMessage: string;
    language: string;
    messages: number;
    from?: string;
    to?: string;
};

function translateContents(
    env: Bindings,
    contents: string[],
    { language, messages, from, to }: TranslateOptions,
) {
    if (from && to) {
        return translateMessages(env, contents, language);
    }
    if (from) {
        return translateFirstConversation(env, contents, language);
    }
    if (to || messages == CONTEXT_MESSAGES) {
        return translateLatestConversation(env, contents, language);
    }
    return translateMessages(env, contents, language);
}

async function sendTranslations(
    interaction: APIInteraction,
    env: Bindings,
    channelId: string,
    options: TranslateOptions,
) {
    const { userId, customMessage, messages, from, to } = options;
    const recent = await getChatMessages(env, channelId, {
        from,
        to,
        limit: messages == CONTEXT_MESSAGES ? MAX_MESSAGES : messages,
    });
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
