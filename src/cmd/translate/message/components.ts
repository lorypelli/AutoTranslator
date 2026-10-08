import {
    type APILabelComponent,
    ComponentType,
    TextInputStyle,
} from 'discord-api-types/v10';
import { MAX_LANGUAGE_LENGTH } from '../../shared/index.js';
import { EPHEMERAL_DESCRIPTION, LANGUAGE_DESCRIPTION } from './constants.js';

export const LANGUAGE_INPUT: APILabelComponent = {
    type: ComponentType.Label,
    label: 'Language',
    description: LANGUAGE_DESCRIPTION,
    component: {
        type: ComponentType.TextInput,
        custom_id: 'language',
        style: TextInputStyle.Short,
        placeholder: 'e.g. English, Spanish, French, Japanese',
        max_length: MAX_LANGUAGE_LENGTH,
        required: false,
    },
};

export const EPHEMERAL_INPUT: APILabelComponent = {
    type: ComponentType.Label,
    label: 'Ephemeral',
    description: EPHEMERAL_DESCRIPTION,
    component: {
        type: ComponentType.Checkbox,
        custom_id: 'ephemeral',
        default: true,
    },
};

export function getMessageInput(text: string): APILabelComponent {
    return {
        type: ComponentType.Label,
        label: 'Message',
        description: 'The text to translate',
        component: {
            type: ComponentType.TextInput,
            custom_id: 'message',
            style: TextInputStyle.Paragraph,
            value: text,
            required: true,
        },
    };
}
