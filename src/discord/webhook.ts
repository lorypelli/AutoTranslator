import {
    type APIInteraction,
    type RESTPatchAPIInteractionOriginalResponseJSONBody,
    type RESTPostAPIInteractionFollowupJSONBody,
    Routes,
} from 'discord-api-types/v10';
import { request } from './rest.js';

export async function followUp(
    interaction: APIInteraction,
    body: RESTPostAPIInteractionFollowupJSONBody,
) {
    await request(
        Routes.webhook(interaction.application_id, interaction.token),
        'Could not send the reply.',
        { method: 'POST', body: JSON.stringify(body) },
    );
}

export async function editOriginal(
    interaction: APIInteraction,
    body: RESTPatchAPIInteractionOriginalResponseJSONBody,
) {
    await request(
        Routes.webhookMessage(interaction.application_id, interaction.token),
        'Could not edit the reply.',
        { method: 'PATCH', body: JSON.stringify(body) },
    );
}

export async function deleteOriginal(interaction: APIInteraction) {
    await request(
        Routes.webhookMessage(interaction.application_id, interaction.token),
        'Could not delete the reply.',
        { method: 'DELETE' },
    );
}
