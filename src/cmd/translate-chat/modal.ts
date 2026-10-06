import type { Modal } from '../../types/index.js';
import { getModalValue } from '../../utils/index.js';
import { DEFAULT_LANGUAGE, DEFAULT_MESSAGES, MODAL_ID } from './constants.js';
import { translate } from './translate.js';

export const TRANSLATE_CHAT_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, [userId]) {
        const messages = getModalValue(interaction, 'messages');
        return translate(interaction, runtime, {
            userId,
            customMessage: getModalValue(interaction, 'custom-message') || '',
            language:
                getModalValue(interaction, 'language') || DEFAULT_LANGUAGE,
            messages: !messages
                ? DEFAULT_MESSAGES
                : /^-?\d+$/.test(messages)
                  ? parseInt(messages)
                  : NaN,
            from: getModalValue(interaction, 'from'),
            to: getModalValue(interaction, 'to'),
        });
    },
};
