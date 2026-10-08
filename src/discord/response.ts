import {
    type APIApplicationCommandAutocompleteResponse,
    type APIInteractionResponse,
    type APILabelComponent,
    InteractionResponseType,
    MessageFlags,
} from 'discord-api-types/v10';

export function error(content: string): APIInteractionResponse {
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content, flags: MessageFlags.Ephemeral },
    };
}

export function deferred(): APIInteractionResponse {
    return {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: { flags: MessageFlags.Ephemeral },
    };
}

export function autocompleteChoices(
    names: string[],
): APIApplicationCommandAutocompleteResponse {
    return {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: { choices: names.map((name) => ({ name, value: name })) },
    };
}

export function showModal(
    customId: string,
    title: string,
    components: APILabelComponent[],
): APIInteractionResponse {
    return {
        type: InteractionResponseType.Modal,
        data: { custom_id: customId, title, components },
    };
}
