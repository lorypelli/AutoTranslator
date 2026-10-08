import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { error, getSubcommand } from '../../discord/index.js';
import type { Runtime, Subcommand } from '../../types/index.js';

export function runSubcommand(
    subcommands: Subcommand[],
    interaction: APIApplicationCommandInteraction,
    runtime: Runtime,
) {
    const name = getSubcommand(interaction);
    const subcommand = subcommands.find((item) => item.data.name == name);
    if (!subcommand) {
        return error('Unknown subcommand.');
    }
    return subcommand.run(interaction, runtime);
}
