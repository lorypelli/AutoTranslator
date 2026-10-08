import { MAX_MESSAGES } from '../../discord/index.js';

export const LANGUAGE_DESCRIPTION =
    'The language to summarize in (default: your preferred or Discord language)';
export const EPHEMERAL_DESCRIPTION = 'Only show the summary to you';
export const FROM_DESCRIPTION = `The ID or link of the first message to summarize (up to ${MAX_MESSAGES} messages from there)`;
export const TO_DESCRIPTION = `The ID or link of the last message to summarize (up to ${MAX_MESSAGES} messages before it)`;
