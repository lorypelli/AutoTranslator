import type { Modal } from '../../types/index.js';
import { getModalCheckbox, getModalValue } from '../../utils/index.js';
import { MODAL_ID } from './constants.js';
import { translateMessage } from './translate.js';

export const TRANSLATE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, [messageId]) {
        return translateMessage(interaction, runtime, messageId, {
            language: getModalValue(interaction, 'language') || '',
            ephemeral: getModalCheckbox(interaction, 'ephemeral') ?? true,
        });
    },
};
