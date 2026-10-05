export const CONTEXT_MESSAGES = -1;
export const MIN_MESSAGES = 1;
export const MAX_MESSAGES = 100;
export const DEFAULT_MESSAGES = 50;
export const MAX_CUSTOM_MESSAGE_LENGTH = 1900;
export const MESSAGES_DESCRIPTION = `Messages to translate without from/to (default: ${DEFAULT_MESSAGES}, use ${CONTEXT_MESSAGES} to have AI understand the context)`;
export const FROM_DESCRIPTION =
    'The ID or link of the first message (without to, the AI finds where the conversation ends)';
export const TO_DESCRIPTION =
    'The ID or link of the last message (without from, the AI finds where the conversation starts)';
export const CUSTOM_MESSAGE_DESCRIPTION =
    'The custom message for the specified user';
export const MODAL_ID = 'auto-translate';
