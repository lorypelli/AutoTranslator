import {
    type APILabelComponent,
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    TextInputStyle,
} from 'discord-api-types/v10';
import type { Command } from '../../../types/index.js';
import {
    ANYWHERE,
    error,
    getReadableChannelId,
    MAX_LANGUAGE_LENGTH,
    toCustomId,
} from '../../../utils/index.js';
import {
    EPHEMERAL_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    MODAL_ID,
} from './constants.js';

export const TRANSLATE_MESSAGE_SELECT_MENU: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.Message,
        name: 'Translate',
    },
    run(interaction) {
        if (interaction.data.type != ApplicationCommandType.Message) {
            return error('This can only be used on a message.');
        }
        const { content } =
            interaction.data.resolved.messages[interaction.data.target_id];
        if (!content) {
            return error('That message has no text to translate.');
        }
        const messageInput: APILabelComponent[] = getReadableChannelId(
            interaction,
        )
            ? []
            : [
                  {
                      type: ComponentType.Label,
                      label: 'Message',
                      description: 'The text to translate',
                      component: {
                          type: ComponentType.TextInput,
                          custom_id: 'message',
                          style: TextInputStyle.Paragraph,
                          value: content,
                          required: true,
                      },
                  },
              ];
        return {
            type: InteractionResponseType.Modal,
            data: {
                custom_id: toCustomId(MODAL_ID, interaction.data.target_id),
                title: 'Translate',
                components: [
                    ...messageInput,
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
                            required: false,
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
