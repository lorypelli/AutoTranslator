import type { APIInteraction, APIMessage } from 'discord-api-types/v10';
import type { Bindings } from '../../types/index.js';
import {
    deleteOriginal,
    editOriginal,
    followUp,
    toEmbed,
    translateMessages,
} from '../../utils/index.js';

type TranslateOptions = {
    text: string;
    language: string;
    ephemeral: boolean;
    message?: APIMessage;
};

export async function sendTranslation(
    interaction: APIInteraction,
    env: Bindings,
    { text, language, ephemeral, message }: TranslateOptions,
) {
    const [translation] = await translateMessages(env, [text], language);
    const embeds = [
        {
            ...toEmbed(translation, message),
            footer: { text: `Translated to ${language}` },
        },
    ];
    if (ephemeral) {
        return editOriginal(interaction, { embeds });
    }
    await deleteOriginal(interaction);
    await followUp(interaction, { embeds });
}
