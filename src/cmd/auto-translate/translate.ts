import type { APIInteraction } from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../types/index.js';
import {
    chunkEmbeds,
    deleteOriginal,
    error,
    followUp,
    getMessages,
    toEmbed,
    translateContext,
    translateMessages,
} from '../../utils/index.js';
import { CONTEXT_MESSAGES, MAX_MESSAGES, MIN_MESSAGES } from './constants.js';

type TranslateOptions = {
    userId: string;
    messages: number;
    customMessage: string;
};

async function sendTranslations(
    interaction: APIInteraction,
    env: Bindings,
    channelId: string,
    { userId, messages, customMessage }: TranslateOptions,
) {
    const fetched = await getMessages(env, channelId, MAX_MESSAGES);
    const recent = fetched.filter(
        (message) => !message.author.bot && message.content,
    );
    if (!recent.length) {
        throw new Error('There are no messages to translate.');
    }
    const contents = recent.map((message) => message.content);
    const translations =
        messages == CONTEXT_MESSAGES
            ? await translateContext(env, contents, 'English')
            : await translateMessages(
                  env,
                  contents.slice(-messages),
                  'English',
              );
    const chunks = chunkEmbeds(
        recent
            .slice(-translations.length)
            .map((message, i) => toEmbed(translations[i], message)),
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
    return defer(sendTranslations(interaction, env, channelId, options));
}
