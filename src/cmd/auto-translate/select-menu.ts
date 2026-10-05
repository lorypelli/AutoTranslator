import {
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    TextInputStyle,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import { error, toCustomId } from '../../utils/index.js';
import {
    CUSTOM_MESSAGE_DESCRIPTION,
    MAX_CUSTOM_MESSAGE_LENGTH,
    MAX_MESSAGES,
    MESSAGES_DESCRIPTION,
    MIN_MESSAGES,
    MODAL_ID,
} from './constants.js';

export const AUTO_TRANSLATE_SELECT_MENU: Command = {
    data: {
        type: ApplicationCommandType.User,
        name: 'Auto Translate',
    },
    run(interaction) {
        if (interaction.data.type != ApplicationCommandType.User) {
            return error('This can only be used on a user.');
        }
        return {
            type: InteractionResponseType.Modal,
            data: {
                custom_id: toCustomId(MODAL_ID, interaction.data.target_id),
                title: 'Auto Translate',
                components: [
                    {
                        type: ComponentType.Label,
                        label: 'Messages',
                        description: MESSAGES_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'messages',
                            style: TextInputStyle.Short,
                            placeholder: `${MIN_MESSAGES} to ${MAX_MESSAGES}`,
                            min_length: 1,
                            max_length: 3,
                            required: true,
                        },
                    },
                    {
                        type: ComponentType.Label,
                        label: 'Custom message',
                        description: CUSTOM_MESSAGE_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'custom-message',
                            style: TextInputStyle.Paragraph,
                            max_length: MAX_CUSTOM_MESSAGE_LENGTH,
                            required: true,
                        },
                    },
                ],
            },
        };
    },
};
