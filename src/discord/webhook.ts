import {
    type APIInteraction,
    type RESTPatchAPIInteractionOriginalResponseJSONBody,
    type RESTPostAPIInteractionFollowupJSONBody,
    Routes,
} from 'discord-api-types/v10';
import { request } from './rest.js';

export async function followUp(
    { application_id: applicationId, token }: APIInteraction,
    body: RESTPostAPIInteractionFollowupJSONBody,
) {
    await request(
        Routes.webhook(applicationId, token),
        'Could not send the reply.',
        { method: 'POST', body: JSON.stringify(body) },
    );
}

export async function editOriginal(
    { application_id: applicationId, token }: APIInteraction,
    body: RESTPatchAPIInteractionOriginalResponseJSONBody,
) {
    await request(
        Routes.webhookMessage(applicationId, token),
        'Could not edit the reply.',
        { method: 'PATCH', body: JSON.stringify(body) },
    );
}

export async function deleteOriginal({
    application_id: applicationId,
    token,
}: APIInteraction) {
    await request(
        Routes.webhookMessage(applicationId, token),
        'Could not delete the reply.',
        { method: 'DELETE' },
    );
}
