import {
    MessageFlags,
    RouteBases,
    Routes,
    type APIEmbed,
    type APIInteraction,
    type APIMessage,
    type RESTPatchAPIInteractionOriginalResponseJSONBody,
    type RESTPostAPIInteractionFollowupJSONBody,
    type RESTPutAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';

async function request(
    route: string,
    errorMessage: string,
    init?: RequestInit,
) {
    const res = await fetch(`${RouteBases.api}${route}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!res.ok) {
        throw new Error(errorMessage);
    }
    return res;
}

function botRequest(
    env: Bindings,
    route: string,
    errorMessage: string,
    init?: RequestInit,
) {
    return request(route, errorMessage, {
        ...init,
        headers: { Authorization: `Bot ${env.BOT_TOKEN}` },
    });
}

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

export function followUpError(interaction: APIInteraction, content: string) {
    return followUp(interaction, { content, flags: MessageFlags.Ephemeral });
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

export async function sendEmbeds(
    interaction: APIInteraction,
    embeds: APIEmbed[],
    ephemeral: boolean,
) {
    if (ephemeral) {
        return editOriginal(interaction, { embeds });
    }
    await deleteOriginal(interaction);
    await followUp(interaction, { embeds });
}

export async function getMessage(
    env: Bindings,
    channelId: string,
    messageId: string,
) {
    const res = await botRequest(
        env,
        Routes.channelMessage(channelId, messageId),
        'Could not fetch the message.',
    );
    const message: APIMessage = await res.json();
    return message;
}

export async function getMessages(
    env: Bindings,
    channelId: string,
    query: Record<string, string>,
) {
    const res = await botRequest(
        env,
        `${Routes.channelMessages(channelId)}?${new URLSearchParams(query)}`,
        'Could not fetch the messages.',
    );
    const messages: APIMessage[] = await res.json();
    return messages.reverse();
}

export async function registerCommands(
    env: Bindings,
    commands: RESTPutAPIApplicationCommandsJSONBody,
) {
    await botRequest(
        env,
        Routes.applicationCommands(env.APPLICATION_ID),
        'Could not register the commands.',
        { method: 'PUT', body: JSON.stringify(commands) },
    );
}
