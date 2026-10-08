import {
    type APIEmbed,
    type APIInteraction,
    MessageFlags,
    type RESTPostAPIInteractionFollowupJSONBody,
} from 'discord-api-types/v10';
import { deleteOriginal, editOriginal, followUp } from './webhook.js';

function followUpError(interaction: APIInteraction, content: string) {
    return followUp(interaction, { content, flags: MessageFlags.Ephemeral });
}

export function followUpOnError(
    interaction: APIInteraction,
    work: Promise<void>,
) {
    return work.then(
        () => null,
        (err: Error) => followUpError(interaction, err.message),
    );
}

export async function followUpPublicly(
    interaction: APIInteraction,
    bodies: RESTPostAPIInteractionFollowupJSONBody[],
) {
    await deleteOriginal(interaction);
    await Array.fromAsync(bodies, (body) => followUp(interaction, body));
}

export async function sendEmbeds(
    interaction: APIInteraction,
    embeds: APIEmbed[],
    ephemeral = true,
) {
    if (ephemeral) {
        return editOriginal(interaction, { embeds });
    }
    return followUpPublicly(interaction, [{ embeds }]);
}
