import {
    MessageFlags,
    RouteBases,
    type APIInteraction,
    type APIMessage,
    type RESTPostAPIInteractionFollowupJSONBody,
} from 'discord-api-types/v10';

export async function followUp(
    interaction: APIInteraction,
    body: RESTPostAPIInteractionFollowupJSONBody,
) {
    const url = `${RouteBases.api}/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}

export async function followUpError(
    interaction: APIInteraction,
    content: string,
) {
    const url = `${RouteBases.api}/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`;
    await fetch(url, { method: 'DELETE' });
    await followUp(interaction, { content, flags: MessageFlags.Ephemeral });
}

export async function getMessages(channelId: string, limit: number) {
    const url = `${RouteBases.api}/channels/${channelId}/messages?limit=${limit}`;
    const res = await fetch(url, {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    });
    if (!res.ok) {
        return undefined;
    }
    const messages: APIMessage[] = await res.json();
    return messages.reverse();
}
