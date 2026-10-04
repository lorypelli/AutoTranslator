import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    MessageFlags,
    type APIApplicationCommandInteraction,
    type APIInteractionResponse,
    type APIModalSubmitInteraction,
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

function findModalComponent(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    return interaction.data.components
        .flatMap((row) => ('component' in row ? [row.component] : []))
        .find((component) => component.custom_id == customId);
}

export function getModalValue(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    const component = findModalComponent(interaction, customId);
    return component?.type == ComponentType.TextInput
        ? component.value
        : undefined;
}

export function getModalCheckbox(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    const component = findModalComponent(interaction, customId);
    return component?.type == ComponentType.Checkbox
        ? component.value
        : undefined;
}

function findOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    return interaction.data.type == ApplicationCommandType.ChatInput
        ? interaction.data.options?.find((option) => option.name == name)
        : undefined;
}

export function getUserOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.User
        ? option.value
        : undefined;
}

export function getIntegerOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.Integer
        ? option.value
        : undefined;
}

export function getStringOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.String
        ? option.value
        : undefined;
}

export function getBooleanOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    const option = findOption(interaction, name);
    return option?.type == ApplicationCommandOptionType.Boolean
        ? option.value
        : undefined;
}
