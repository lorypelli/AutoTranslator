import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandInteraction,
    type APIInteraction,
    type APIInteractionResponse,
    type APIModalSubmitInteraction,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    MessageFlags,
} from 'discord-api-types/v10';

const CUSTOM_ID_SEPARATOR = ':';

export function error(content: string): APIInteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content, flags: MessageFlags.Ephemeral },
    };
}

export function toCustomId(...parts: string[]) {
    return parts.join(CUSTOM_ID_SEPARATOR);
}

export function fromCustomId(customId: string) {
    return customId.split(CUSTOM_ID_SEPARATOR);
}

export function getUserId(interaction: APIInteraction) {
    return interaction.member?.user.id ?? interaction.user?.id ?? null;
}

function findModalComponent(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    return (
        interaction.data.components
            .flatMap((row) =>
                row.type == ComponentType.Label ? [row.component] : [],
            )
            .find((component) => component.custom_id == customId) ?? null
    );
}

export function getModalValue(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    const component = findModalComponent(interaction, customId);
    return component?.type == ComponentType.TextInput ? component.value : null;
}

export function getModalCheckbox(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    const component = findModalComponent(interaction, customId);
    return component?.type == ComponentType.Checkbox ? component.value : null;
}

function findOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    return interaction.data.type == ApplicationCommandType.ChatInput
        ? (interaction.data.options
              ?.flatMap((option) =>
                  option.type == ApplicationCommandOptionType.Subcommand
                      ? (option.options ?? [])
                      : [option],
              )
              .find((option) => option.name == name) ?? null)
        : null;
}

export function getSubcommand(interaction: APIApplicationCommandInteraction) {
    return interaction.data.type == ApplicationCommandType.ChatInput
        ? (interaction.data.options?.find(
              (option) =>
                  option.type == ApplicationCommandOptionType.Subcommand,
          )?.name ?? null)
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

export function getIntegerOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.Integer
        ? option.value
        : null;
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

export function getBooleanOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.Boolean
        ? option.value
        : null;
}

export function getFocusedString(
    interaction: APIApplicationCommandAutocompleteInteraction,
) {
    return (
        interaction.data.options
            ?.flatMap((option) =>
                option.type == ApplicationCommandOptionType.Subcommand
                    ? (option.options ?? [])
                    : [option],
            )
            .flatMap((option) =>
                option.type == ApplicationCommandOptionType.String &&
                option.focused
                    ? [option.value]
                    : [],
            )[0] ?? null
    );
}
