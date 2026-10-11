import { HELP_COMMAND } from './help/index.js';
import { INVITE_COMMAND } from './invite/index.js';
import { LANGUAGE_COMMAND } from './language/index.js';
import { REGISTER_COMMAND } from './register/index.js';
import { SUMMARIZE_COMMAND } from './summarize/index.js';
import {
    TRANSLATE_CHAT_CONTEXT_MENU,
    TRANSLATE_CHAT_MODAL,
    TRANSLATE_COMMAND,
    TRANSLATE_MESSAGE_CONTEXT_MENU,
    TRANSLATE_MESSAGE_MODAL,
} from './translate/index.js';

export const COMMANDS = [
    HELP_COMMAND,
    INVITE_COMMAND,
    LANGUAGE_COMMAND,
    REGISTER_COMMAND,
    SUMMARIZE_COMMAND,
    TRANSLATE_COMMAND,
    TRANSLATE_CHAT_CONTEXT_MENU,
    TRANSLATE_MESSAGE_CONTEXT_MENU,
];

export const MODALS = [TRANSLATE_CHAT_MODAL, TRANSLATE_MESSAGE_MODAL];
