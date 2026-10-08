import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandInteraction,
    type APIInteraction,
    type APIModalSubmitInteraction,
    InteractionResponseType,
    InteractionType,
} from 'discord-api-types/v10';
import { autocompleteChoices, error, fromCustomId } from '../discord/index.js';
import type { Runtime } from '../types/index.js';
import { COMMANDS, MODALS } from './commands.js';

function findCommand(name: string) {
    return COMMANDS.find((command) => command.data.name == name) ?? null;
}

function runCommand(
    interaction: APIApplicationCommandInteraction,
    runtime: Runtime,
) {
    const command = findCommand(interaction.data.name);
    if (!command) {
        return error('Unknown command.');
    }
    return command.run(interaction, runtime);
}

async function runAutocomplete(
    interaction: APIApplicationCommandAutocompleteInteraction,
    runtime: Runtime,
) {
    const command = findCommand(interaction.data.name);
    if (!command?.autocomplete) {
        return autocompleteChoices([]);
    }
    return command.autocomplete(interaction, runtime);
}

function runModal(interaction: APIModalSubmitInteraction, runtime: Runtime) {
    const { id, targetId } = fromCustomId(interaction.data.custom_id);
    const modal = MODALS.find((item) => item.id == id);
    if (!modal) {
        return error('Unknown modal.');
    }
    return modal.run(interaction, runtime, targetId);
}

export async function handleInteraction(
    interaction: APIInteraction,
    runtime: Runtime,
) {
    if (interaction.type == InteractionType.Ping) {
        return { type: InteractionResponseType.Pong };
    }
    if (interaction.type == InteractionType.ApplicationCommand) {
        return runCommand(interaction, runtime);
    }
    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
        return runAutocomplete(interaction, runtime);
    }
    if (interaction.type == InteractionType.ModalSubmit) {
        return runModal(interaction, runtime);
    }
    return error('Unknown interaction.');
}
