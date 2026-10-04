import type { Modal } from '../../types/index.js';
import { getModalValue } from '../../utils/index.js';
import { MODAL_ID } from './constants.js';
import { translate } from './translate.js';

export const AUTO_TRANSLATE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, [userId]) {
        return translate(interaction, runtime, {
            userId,
            messages: parseInt(getModalValue(interaction, 'messages') || '0'),
            customMessage: getModalValue(interaction, 'custom-message') || '',
        });
    },
};
