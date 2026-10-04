import type { APIInteraction, APIMessage } from 'discord-api-types/v10';
import type { Bindings } from '../../types/index.js';
import {
    deleteOriginal,
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
    if (!ephemeral) {
        await deleteOriginal(interaction);
    }
    await followUp(interaction, {
        embeds: [
            {
                ...toEmbed(translation, message),
                footer: { text: `Translated to ${language}` },
            },
        ],
    });
}
