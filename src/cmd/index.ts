import {
    type APIInteraction,
    type APIInteractionResponse,
    InteractionResponseType,
    InteractionType,
} from 'discord-api-types/v10';
import type { Runtime } from '../types/index.js';
import { error, fromCustomId } from '../utils/index.js';
import { SUMMARIZE_COMMAND } from './summarize/index.js';
import {
    TRANSLATE_CHAT_MODAL,
    TRANSLATE_CHAT_SELECT_MENU,
    TRANSLATE_COMMAND,
    TRANSLATE_MESSAGE_MODAL,
    TRANSLATE_MESSAGE_SELECT_MENU,
} from './translate/index.js';

export const COMMANDS = [
    SUMMARIZE_COMMAND,
    TRANSLATE_COMMAND,
    TRANSLATE_CHAT_SELECT_MENU,
    TRANSLATE_MESSAGE_SELECT_MENU,
];

const MODALS = [TRANSLATE_CHAT_MODAL, TRANSLATE_MESSAGE_MODAL];

export async function handleInteraction(
    interaction: APIInteraction,
    runtime: Runtime,
): Promise<APIInteractionResponse> {
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
    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
        return (
            (await COMMANDS.find(
                (command) => command.data.name == interaction.data.name,
            )?.autocomplete?.(interaction, runtime)) ?? {
                type: InteractionResponseType.ApplicationCommandAutocompleteResult,
                data: { choices: [] },
            }
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
    return error('Unknown interaction.');
}
