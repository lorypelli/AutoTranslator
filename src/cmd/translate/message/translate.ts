import type {
    APIApplicationCommandInteraction,
    APIMessage,
    APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import {
    detectLanguage,
    getLanguageName,
    translateText,
    withTimeout,
} from '../../../ai/index.js';
import {
    error,
    getMessage,
    getReadableChannelId,
    getUserId,
    sendEmbeds,
    toEmbed,
} from '../../../discord/index.js';
import type { Bindings, Runtime } from '../../../types/index.js';
import { orNull } from '../../../utils/index.js';
import { resolveLanguage } from '../../shared/index.js';
import { NO_TEXT_ERROR } from './constants.js';

type TranslateInteraction =
    | APIApplicationCommandInteraction
    | APIModalSubmitInteraction;

type TranslateMessageOptions = {
    language: string | null;
    ephemeral: boolean;
};

function getFooterText(target: string, source: string | null) {
    if (source) {
        return `Translated from ${source} to ${target}`;
    }
    return `Translated to ${target}`;
}

async function translateToEmbed(
    env: Bindings,
    text: string,
    language: string,
    message?: APIMessage,
) {
    const [translation, target, source] = await Promise.all([
        translateText(env, text, language),
        getLanguageName(env, language),
        orNull(detectLanguage(env, text)),
    ]);
    return {
        ...toEmbed(translation, message),
        footer: { text: getFooterText(target, source) },
    };
}

async function sendTranslation(
    interaction: TranslateInteraction,
    env: Bindings,
    text: string,
    options: TranslateMessageOptions,
    message?: APIMessage,
) {
    const language = await resolveLanguage(
        env,
        options.language,
        getUserId(interaction),
        interaction.locale,
    );
    const embed = await withTimeout(
        translateToEmbed(env, text, language, message),
    );
    await sendEmbeds(interaction, [embed], options.ephemeral);
}

async function sendTranslationFromId(
    interaction: TranslateInteraction,
    env: Bindings,
    channelId: string,
    messageId: string,
    options: TranslateMessageOptions,
) {
    const message = await getMessage(env, channelId, messageId);
    if (!message.content) {
        throw new Error(NO_TEXT_ERROR);
    }
    await sendTranslation(interaction, env, message.content, options, message);
}

export function translateFromText(
    interaction: TranslateInteraction,
    { env, defer }: Runtime,
    text: string,
    options: TranslateMessageOptions,
) {
    return defer(sendTranslation(interaction, env, text, options));
}

export function translateFromId(
    interaction: TranslateInteraction,
    { env, defer }: Runtime,
    messageId: string,
    options: TranslateMessageOptions,
) {
    const channelId = getReadableChannelId(interaction);
    if (!channelId) {
        return error(
            'Message IDs and links only work in servers and DMs the bot is in.',
        );
    }
    return defer(
        sendTranslationFromId(interaction, env, channelId, messageId, options),
    );
}
