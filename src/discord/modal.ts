import {
    type APIModalSubmitInteraction,
    ComponentType,
} from 'discord-api-types/v10';

const CUSTOM_ID_SEPARATOR = ':';

export function toCustomId(id: string, targetId: string) {
    return `${id}${CUSTOM_ID_SEPARATOR}${targetId}`;
}

export function fromCustomId(customId: string) {
    const [id = '', targetId = ''] = customId.split(CUSTOM_ID_SEPARATOR);
    return { id, targetId };
}

function findModalComponent(
    interaction: APIModalSubmitInteraction,
    customId: string,
) {
    const labels = interaction.data.components.filter(
        (row) => row.type == ComponentType.Label,
    );
    const label = labels.find((item) => item.component.custom_id == customId);
    return label?.component ?? null;
}

export function getModalText(
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
