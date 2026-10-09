import {
    type APILabelComponent,
    ComponentType,
    TextInputStyle,
} from 'discord-api-types/v10';
import { MAX_MESSAGES } from '../../../discord/index.js';
import { MAX_LANGUAGE_LENGTH } from '../../shared/index.js';
import {
    CONTEXT_MESSAGES,
    CUSTOM_MESSAGE_DESCRIPTION,
    DEFAULT_LANGUAGE,
    FROM_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    MAX_CUSTOM_MESSAGE_LENGTH,
    MAX_MESSAGES_INPUT_LENGTH,
    MESSAGES_DESCRIPTION,
    MIN_MESSAGES,
    TO_DESCRIPTION,
} from './constants.js';

export const MODAL_INPUTS: APILabelComponent[] = [
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
            max_length: MAX_MESSAGES_INPUT_LENGTH,
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
];
