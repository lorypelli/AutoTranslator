export const MODAL_ID = 'translate-chat';
export const INTEGER_REGEX = /^-?\d+$/;
export const CONTEXT_MESSAGES = -1;
export const MIN_MESSAGES = 1;
export const DEFAULT_MESSAGES = 50;
export const MAX_MESSAGES_LENGTH = 3;
export const DEFAULT_LANGUAGE = 'English';
export const MAX_CUSTOM_MESSAGE_LENGTH = 1900;
export const CUSTOM_MESSAGE_DESCRIPTION =
    'The custom message for the specified user';
export const LANGUAGE_DESCRIPTION = `The language to translate into (default: their preferred language or ${DEFAULT_LANGUAGE})`;
export const MESSAGES_DESCRIPTION = `Messages to translate without from/to (default: ${DEFAULT_MESSAGES}, use ${CONTEXT_MESSAGES} to have AI understand the context)`;
export const FROM_DESCRIPTION =
    'The ID or link of the first message (without to, the AI finds where the conversation ends)';
export const TO_DESCRIPTION =
    'The ID or link of the last message (without from, the AI finds where the conversation starts)';
