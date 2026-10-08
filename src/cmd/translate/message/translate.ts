import type {
    APIApplicationCommandInteraction,
    APIMessage,
    APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../../types/index.js';
import {
    detectLanguage,
    error,
    getLanguageName,
    getMessage,
    getPreferredLanguage,
    getReadableChannelId,
    getUserId,
    orNull,
    sendEmbeds,
    toEmbed,
    translateMessages,
} from '../../../utils/index.js';

type TranslateInteraction =
    | APIApplicationCommandInteraction
    | APIModalSubmitInteraction;

type TranslateOptions = {
    language: string | null;
    ephemeral: boolean;
};

export async function sendTranslation(
    interaction: TranslateInteraction,
    env: Bindings,
    text: string,
    options: TranslateOptions,
    message?: APIMessage,
) {
    const language =
        options.language ||
        (await getPreferredLanguage(env, getUserId(interaction))) ||
        interaction.locale;
    const [[translation], languageName, sourceName] = await Promise.all([
        translateMessages(env, [text], language),
        getLanguageName(env, language),
        orNull(detectLanguage(env, text)),
    ]);
    const footer = sourceName
        ? `Translated from ${sourceName} to ${languageName}`
        : `Translated to ${languageName}`;
    await sendEmbeds(
        interaction,
        [{ ...toEmbed(translation, message), footer: { text: footer } }],
        options.ephemeral,
    );
}

async function sendMessageTranslation(
    interaction: TranslateInteraction,
    env: Bindings,
    channelId: string,
    messageId: string,
    options: TranslateOptions,
) {
    const message = await getMessage(env, channelId, messageId);
    if (!message.content) {
        throw new Error('That message has no text to translate.');
    }
    await sendTranslation(interaction, env, message.content, options, message);
}

export function translateMessage(
    interaction: TranslateInteraction,
    { env, defer }: Runtime,
    messageId: string,
    options: TranslateOptions,
) {
    const channelId = getReadableChannelId(interaction);
    if (!channelId) {
        return error(
            'Message IDs and links only work in servers and DMs the bot is in.',
        );
    }
    return defer(
        sendMessageTranslation(interaction, env, channelId, messageId, options),
    );
}
