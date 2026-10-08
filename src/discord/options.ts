import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandInteraction,
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';

function getOptions(interaction: APIApplicationCommandInteraction) {
    if (interaction.data.type != ApplicationCommandType.ChatInput) {
        return [];
    }
    const options = interaction.data.options ?? [];
    return options.flatMap((option) =>
        option.type == ApplicationCommandOptionType.Subcommand
            ? (option.options ?? [])
            : [option],
    );
}

function findOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    return (
        getOptions(interaction).find((option) => option.name == name) ?? null
    );
}

export function getSubcommand(interaction: APIApplicationCommandInteraction) {
    if (interaction.data.type != ApplicationCommandType.ChatInput) {
        return null;
    }
    const subcommand = interaction.data.options?.find(
        (option) => option.type == ApplicationCommandOptionType.Subcommand,
    );
    return subcommand?.name ?? null;
}

export function getStringOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.String
        ? option.value
        : null;
}

export function getIntegerOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.Integer
        ? option.value
        : null;
}

export function getBooleanOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.Boolean
        ? option.value
        : null;
}

export function getUserOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.User
        ? option.value
        : null;
}

export function getFocusedString(
    interaction: APIApplicationCommandAutocompleteInteraction,
) {
    const options = interaction.data.options ?? [];
    const strings = options
        .flatMap((option) =>
            option.type == ApplicationCommandOptionType.Subcommand
                ? (option.options ?? [])
                : [option],
        )
        .filter((option) => option.type == ApplicationCommandOptionType.String);
    const focused = strings.find((option) => option.focused);
    return focused?.value ?? null;
}
