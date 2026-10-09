import { getModalText } from '../../../discord/index.js';
import type { Modal } from '../../../types/index.js';
import { DEFAULT_MESSAGES, INTEGER_REGEX, MODAL_ID } from './constants.js';
import { translate } from './translate.js';

function parseCount(text: string | null) {
    if (!text) {
        return DEFAULT_MESSAGES;
    }
    if (INTEGER_REGEX.test(text)) {
        return parseInt(text, 10);
    }
    return NaN;
}

export const TRANSLATE_CHAT_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, userId) {
        return translate(interaction, runtime, {
            userId,
            customMessage: getModalText(interaction, 'custom-message') || '',
            language: getModalText(interaction, 'language'),
            count: parseCount(getModalText(interaction, 'messages')),
            from: getModalText(interaction, 'from'),
            to: getModalText(interaction, 'to'),
        });
    },
};
