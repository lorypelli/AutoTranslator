import {
    type APIInteraction,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import {
    ANYWHERE,
    error,
    getReadableChannelId,
    showModal,
    toCustomId,
} from '../../../discord/index.js';
import type { Command } from '../../../types/index.js';
import {
    EPHEMERAL_INPUT,
    getMessageInput,
    LANGUAGE_INPUT,
} from './components.js';
import { MODAL_ID, NO_TEXT_ERROR } from './constants.js';

function getModalInputs(interaction: APIInteraction, text: string) {
    if (getReadableChannelId(interaction)) {
        return [LANGUAGE_INPUT, EPHEMERAL_INPUT];
    }
    return [getMessageInput(text), LANGUAGE_INPUT, EPHEMERAL_INPUT];
}

export const TRANSLATE_MESSAGE_CONTEXT_MENU: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.Message,
        name: 'Translate',
    },
    run(interaction) {
        if (interaction.data.type != ApplicationCommandType.Message) {
            return error('This can only be used on a message.');
        }
        const message =
            interaction.data.resolved.messages[interaction.data.target_id];
        if (!message?.content) {
            return error(NO_TEXT_ERROR);
        }
        const customId = toCustomId(MODAL_ID, interaction.data.target_id);
        const inputs = getModalInputs(interaction, message.content);
        return showModal(customId, 'Translate', inputs);
    },
};
