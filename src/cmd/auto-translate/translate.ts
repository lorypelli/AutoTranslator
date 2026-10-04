import type { APIInteraction } from 'discord-api-types/v10';
import type { Defer } from '../../types/index.js';
import {
    error,
    followUp,
    followUpError,
    getMessages,
    toEmbed,
} from '../../utils/index.js';
import { MAX_EMBEDS, MAX_MESSAGES } from './constants.js';

async function sendMessages(
    interaction: APIInteraction,
    channelId: string,
    userId: string,
    messages: number,
    customMessage: string,
) {
    const fetched = await getMessages(channelId, MAX_MESSAGES);
    if (!fetched) {
        await followUpError(interaction, 'Could not fetch the messages.');
        return;
    }
    const humans = fetched
        .filter((message) => !message.author.bot)
        .slice(-messages);
    if (!humans.length) {
        await followUpError(interaction, 'There are no messages to translate.');
        return;
    }
    const embeds = humans.map(toEmbed);
    for (let i = 0; i < embeds.length; i += MAX_EMBEDS) {
        await followUp(interaction, {
            content: i == 0 ? `<@${userId}> ${customMessage}` : undefined,
            embeds: embeds.slice(i, i + MAX_EMBEDS),
            allowed_mentions: { users: [userId] },
        });
    }
}

export function translate(
    interaction: APIInteraction,
    defer: Defer,
    userId: string,
    messages: number,
    customMessage: string,
) {
    if (!interaction.channel_id) {
        return error('This can only be used in a channel.');
    }
    if (messages < 1) {
        return error('Provide at least 1 message to translate.');
    }
    return defer(
        sendMessages(
            interaction,
            interaction.channel_id,
            userId,
            messages,
            customMessage,
        ),
    );
}
