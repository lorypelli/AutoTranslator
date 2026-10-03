import type {
    APIInteraction as Interaction,
    RESTPostAPIInteractionFollowupJSONBody as FollowUpBody,
} from 'discord-api-types/v10';

export async function followUp(interaction: Interaction, body: FollowUpBody) {
    const url = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}
