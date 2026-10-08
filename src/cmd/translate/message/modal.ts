import type { Modal } from '../../../types/index.js';
import { getModalCheckbox, getModalValue } from '../../../utils/index.js';
import { MODAL_ID } from './constants.js';
import { sendTranslation, translateMessage } from './translate.js';

export const TRANSLATE_MESSAGE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, [messageId]) {
        const text = getModalValue(interaction, 'message');
        const options = {
            language: getModalValue(interaction, 'language'),
            ephemeral: getModalCheckbox(interaction, 'ephemeral') ?? true,
        };
        if (text) {
            return runtime.defer(
                sendTranslation(interaction, runtime.env, text, options),
            );
        }
        return translateMessage(interaction, runtime, messageId, options);
    },
};
