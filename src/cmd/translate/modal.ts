import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { Bindings, Modal } from '../../types/index.js';
import {
    error,
    getMessage,
    getModalCheckbox,
    getModalValue,
} from '../../utils/index.js';
import { MODAL_ID } from './constants.js';
import { sendTranslation } from './translate.js';

async function translateMessage(
    interaction: APIModalSubmitInteraction,
    env: Bindings,
    channelId: string,
    messageId: string,
) {
    const message = await getMessage(env, channelId, messageId);
    if (!message.content) {
        throw new Error('That message has no text to translate.');
    }
    await sendTranslation(interaction, env, {
        text: message.content,
        language: getModalValue(interaction, 'language') || '',
        ephemeral: getModalCheckbox(interaction, 'ephemeral') ?? true,
        message,
    });
}

export const TRANSLATE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, { env, defer }, [messageId]) {
        const channelId = interaction.channel?.id;
        if (!channelId) {
            return error('This can only be used in a channel.');
        }
        return defer(translateMessage(interaction, env, channelId, messageId));
    },
};
