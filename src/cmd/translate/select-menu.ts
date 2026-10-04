import {
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    TextInputStyle,
} from 'discord-api-types/v10';
import type { Command } from '../../types/index.js';
import { error, toCustomId } from '../../utils/index.js';
import {
    EPHEMERAL_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    MAX_LANGUAGE_LENGTH,
    MODAL_ID,
} from './constants.js';

export const TRANSLATE_SELECT_MENU: Command = {
    data: {
        type: ApplicationCommandType.Message,
        name: 'Translate',
    },
    run(interaction) {
        if (interaction.data.type != ApplicationCommandType.Message) {
            return error('This can only be used on a message.');
        }
        return {
            type: InteractionResponseType.Modal,
            data: {
                custom_id: toCustomId(MODAL_ID, interaction.data.target_id),
                title: 'Translate',
                components: [
                    {
                        type: ComponentType.Label,
                        label: 'Language',
                        description: LANGUAGE_DESCRIPTION,
                        component: {
                            type: ComponentType.TextInput,
                            custom_id: 'language',
                            style: TextInputStyle.Short,
                            placeholder:
                                'e.g. English, Spanish, French, Japanese',
                            max_length: MAX_LANGUAGE_LENGTH,
                            required: true,
                        },
                    },
                    {
                        type: ComponentType.Label,
                        label: 'Ephemeral',
                        description: EPHEMERAL_DESCRIPTION,
                        component: {
                            type: ComponentType.Checkbox,
                            custom_id: 'ephemeral',
                            default: true,
                        },
                    },
                ],
            },
        };
    },
};
