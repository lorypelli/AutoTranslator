import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { error, getSubcommand } from '../../discord/index.js';
import type { Runtime, Subcommand } from '../../types/index.js';

export function runSubcommand(
    interaction: APIApplicationCommandInteraction,
    runtime: Runtime,
    subcommands: Subcommand[],
) {
    const name = getSubcommand(interaction);
    const subcommand = subcommands.find((item) => item.data.name == name);
    if (!subcommand) {
        return error('Unknown subcommand.');
    }
    return subcommand.run(interaction, runtime);
}
