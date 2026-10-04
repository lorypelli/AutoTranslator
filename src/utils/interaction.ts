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

export function error(content: string): APIInteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content, flags: MessageFlags.Ephemeral },
    };
}

export function getModalValue(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    for (const row of interaction.data.components) {
        const component = 'component' in row ? row.component : undefined;
        if (
            component?.type == ComponentType.TextInput &&
            component.custom_id == customId
        ) {
            return component.value;
        }
    }
    return undefined;
}

function findOption(
    interaction: APIApplicationCommandInteraction,
    name: string,
) {
    if (interaction.data.type != ApplicationCommandType.ChatInput) {
        return undefined;
    }
    return interaction.data.options?.find((opt) => opt.name == name);
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
