import type { APIInteraction, APIMessage } from 'discord-api-types/v10';
import type { Bindings, Runtime } from '../../types/index.js';
import {
    detectLanguage,
    error,
    getLanguageName,
    getMessage,
    sendEmbeds,
    toEmbed,
    translateMessages,
} from '../../utils/index.js';

type TranslateOptions = {
    language: string;
    ephemeral: boolean;
};

export async function sendTranslation(
    interaction: APIInteraction,
    env: Bindings,
    text: string,
    { language, ephemeral }: TranslateOptions,
    message?: APIMessage,
) {
    const [[translation], languageName, sourceName] = await Promise.all([
        translateMessages(env, [text], language),
        getLanguageName(env, language),
        detectLanguage(env, text).then(
            (name) => name,
            () => undefined,
        ),
    ]);
    const footer = sourceName
        ? `Translated from ${sourceName} to ${languageName}`
        : `Translated to ${languageName}`;
    await sendEmbeds(
        interaction,
        [{ ...toEmbed(translation, message), footer: { text: footer } }],
        ephemeral,
    );
}

async function sendMessageTranslation(
    interaction: APIInteraction,
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
    interaction: APIInteraction,
    { env, defer }: Runtime,
    messageId: string,
    options: TranslateOptions,
) {
    const channelId = interaction.channel?.id;
    if (!channelId) {
        return error('This can only be used in a channel.');
    }
    return defer(
        sendMessageTranslation(interaction, env, channelId, messageId, options),
    );
}
