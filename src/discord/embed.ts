import type { APIEmbed, APIMessage } from 'discord-api-types/v10';
import { getAvatarUrl, getDisplayName } from './user.js';

const MAX_DESCRIPTION_LENGTH = 4096;
const MAX_EMBEDS = 10;
const MAX_EMBEDS_LENGTH = 6000;
const EMBED_COLOR = 0x6845d8;

export function toEmbed(description: string, message?: APIMessage) {
    return {
        color: EMBED_COLOR,
        author: message && {
            name: getDisplayName(message.author),
            icon_url: getAvatarUrl(message.author),
        },
        description: description.slice(0, MAX_DESCRIPTION_LENGTH) || undefined,
        timestamp: message?.timestamp,
    };
}

function embedLength(embed: APIEmbed) {
    return (embed.author?.name.length || 0) + (embed.description?.length || 0);
}

function fits(chunk: APIEmbed[], embed: APIEmbed) {
    const total = chunk.reduce((sum, item) => sum + embedLength(item), 0);
    return (
        chunk.length < MAX_EMBEDS &&
        total + embedLength(embed) <= MAX_EMBEDS_LENGTH
    );
}

export function chunkEmbeds(embeds: APIEmbed[]) {
    return embeds.reduce((chunks: APIEmbed[][], embed) => {
        const last = chunks.at(-1);
        if (last && fits(last, embed)) {
            last.push(embed);
        } else {
            chunks.push([embed]);
        }
        return chunks;
    }, []);
}
