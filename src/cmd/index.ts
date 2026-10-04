import {
    InteractionResponseType,
    InteractionType,
    type APIInteraction,
    type APIInteractionResponse,
} from 'discord-api-types/v10';
import type { Runtime } from '../types/index.js';
import { error, fromCustomId } from '../utils/index.js';
import {
    AUTO_TRANSLATE_COMMAND,
    AUTO_TRANSLATE_MODAL,
    AUTO_TRANSLATE_SELECT_MENU,
} from './auto-translate/index.js';
import {
    TRANSLATE_COMMAND,
    TRANSLATE_MODAL,
    TRANSLATE_SELECT_MENU,
} from './translate/index.js';

export const COMMANDS = [
    AUTO_TRANSLATE_COMMAND,
    AUTO_TRANSLATE_SELECT_MENU,
    TRANSLATE_COMMAND,
    TRANSLATE_SELECT_MENU,
];

const MODALS = [AUTO_TRANSLATE_MODAL, TRANSLATE_MODAL];

export function handleInteraction(
    interaction: APIInteraction,
    runtime: Runtime,
): APIInteractionResponse | undefined {
    if (interaction.type == InteractionType.Ping) {
        return { type: InteractionResponseType.Pong };
    }
    if (interaction.type == InteractionType.ApplicationCommand) {
        return (
            COMMANDS.find(
                (command) => command.data.name == interaction.data.name,
            )?.run(interaction, runtime) ?? error('Unknown command.')
        );
    }
    if (interaction.type == InteractionType.ModalSubmit) {
        const [id, ...args] = fromCustomId(interaction.data.custom_id);
        return (
            MODALS.find((modal) => modal.id == id)?.run(
                interaction,
                runtime,
                args,
            ) ?? error('Unknown modal.')
        );
    }
    return undefined;
}
