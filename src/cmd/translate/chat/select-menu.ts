import {
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    TextInputStyle,
} from 'discord-api-types/v10';
import type { Command } from '../../../types/index.js';
import {
    error,
    FROM_DESCRIPTION,
    MAX_LANGUAGE_LENGTH,
    MAX_MESSAGES,
    TO_DESCRIPTION,
    toCustomId,
    WITH_BOT,
} from '../../../utils/index.js';
import {
    CONTEXT_MESSAGES,
    CUSTOM_MESSAGE_DESCRIPTION,
    DEFAULT_LANGUAGE,
    LANGUAGE_DESCRIPTION,
    MAX_CUSTOM_MESSAGE_LENGTH,
    MESSAGES_DESCRIPTION,
    MIN_MESSAGES,
    MODAL_ID,
} from './constants.js';

export const TRANSLATE_CHAT_SELECT_MENU: Command = {
    data: {
        ...WITH_BOT,
        type: ApplicationCommandType.User,
        name: 'Translate Chat',
    },
    run(interaction) {
        if (interaction.data.type != ApplicationCommandType.User) {
            return error('This can only be used on a user.');
        }
        return {
            type: InteractionResponseType.Modal,
            data: {
                custom_id: toCustomId(MODAL_ID, interaction.data.target_id),
                title: 'Translate Chat',
                components: [
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
                    {
                        type: ComponentType.Label,
                        label: 'Language',
                        description: LANGUAGE_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'language',
                            style: TextInputStyle.Short,
                            placeholder: DEFAULT_LANGUAGE,
                            max_length: MAX_LANGUAGE_LENGTH,
                            required: false,
                        },
                    },
                    {
                        type: ComponentType.Label,
                        label: 'Messages',
                        description: MESSAGES_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'messages',
                            style: TextInputStyle.Short,
                            placeholder: `${CONTEXT_MESSAGES}, or ${MIN_MESSAGES} to ${MAX_MESSAGES}`,
                            max_length: 3,
                            required: false,
                        },
                    },
                    {
                        type: ComponentType.Label,
                        label: 'From',
                        description: FROM_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'from',
                            style: TextInputStyle.Short,
                            required: false,
                        },
                    },
                    {
                        type: ComponentType.Label,
                        label: 'To',
                        description: TO_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'to',
                            style: TextInputStyle.Short,
                            required: false,
                        },
                    },
                ],
            },
        };
    },
};
