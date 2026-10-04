import type { Modal } from '../../types/index.js';
import { error, getModalValue } from '../../utils/index.js';
import { MAX_MESSAGES, MIN_MESSAGES, MODAL_ID } from './constants.js';
import { translate } from './translate.js';

export const AUTO_TRANSLATE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, defer, [userId]) {
        const messages = parseInt(
            getModalValue(interaction, 'messages') || '0',
        );
        if (
            !Number.isInteger(messages) ||
            messages < MIN_MESSAGES ||
            messages > MAX_MESSAGES
        ) {
            return error(
                `Messages must be an integer between ${MIN_MESSAGES} and ${MAX_MESSAGES}.`,
            );
        }
        const customMessage = getModalValue(interaction, 'custom-message');
        return translate(
            interaction,
            defer,
            userId,
            messages,
            customMessage?.toString() || '',
        );
    },
};
