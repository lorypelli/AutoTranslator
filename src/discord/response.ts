import {
    type APIApplicationCommandAutocompleteResponse,
    type APIInteraction,
    type APIInteractionResponse,
    type APILabelComponent,
    InteractionResponseType,
    MessageFlags,
} from 'discord-api-types/v10';
import { toEmbed } from './embed.js';
import { getUser } from './user.js';

export function pong(): APIInteractionResponse {
    return {
        type: InteractionResponseType.Pong,
    };
}

export function error(content: string): APIInteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content,
            flags: MessageFlags.Ephemeral,
        },
    };
}

export function embedResponse(
    interaction: APIInteraction,
    description: string,
): APIInteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            embeds: [toEmbed(description, getUser(interaction))],
            flags: MessageFlags.Ephemeral,
        },
    };
}

export function deferred(): APIInteractionResponse {
    return {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
            flags: MessageFlags.Ephemeral,
        },
    };
}

export function autocompleteChoices(
    names: string[],
): APIApplicationCommandAutocompleteResponse {
    return {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
            choices: names.map((name) => ({
                name,
                value: name,
            })),
        },
    };
}

export function showModal(
    customId: string,
    title: string,
    components: APILabelComponent[],
): APIInteractionResponse {
    return {
        type: InteractionResponseType.Modal,
        data: {
            custom_id: customId,
            title,
            components,
        },
    };
}
