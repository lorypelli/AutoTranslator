import type { Modal } from '../../types/index.js';
import { getModalValue } from '../../utils/index.js';
import { DEFAULT_MESSAGES, MODAL_ID } from './constants.js';
import { translate } from './translate.js';

export const AUTO_TRANSLATE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, [userId]) {
        const messages = getModalValue(interaction, 'messages');
        return translate(interaction, runtime, {
            userId,
            customMessage: getModalValue(interaction, 'custom-message') || '',
            messages: messages ? parseInt(messages) : DEFAULT_MESSAGES,
            from: getModalValue(interaction, 'from'),
            to: getModalValue(interaction, 'to'),
        });
    },
};
