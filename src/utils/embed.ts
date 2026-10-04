import {
    CDNRoutes,
    ImageFormat,
    RouteBases,
    type APIEmbed,
    type APIMessage,
    type APIUser,
} from 'discord-api-types/v10';

const MAX_DESCRIPTION_LENGTH = 4096;
const MAX_EMBEDS = 10;
const MAX_EMBEDS_LENGTH = 6000;
const SNOWFLAKE_TIMESTAMP_SHIFT = 22n;
const DEFAULT_AVATARS = 6n;

export function getAvatarUrl(user: APIUser) {
    if (user.avatar) {
        return `${RouteBases.cdn}${CDNRoutes.userAvatar(user.id, user.avatar, ImageFormat.PNG)}`;
    }
    const index =
        (BigInt(user.id) >> SNOWFLAKE_TIMESTAMP_SHIFT) % DEFAULT_AVATARS;
    return `${RouteBases.cdn}/embed/avatars/${index}.png`;
}

export function toEmbed(description: string, message?: APIMessage): APIEmbed {
    return {
        author: message && {
            name: message.author.global_name ?? message.author.username,
            icon_url: getAvatarUrl(message.author),
        },
        description: description.slice(0, MAX_DESCRIPTION_LENGTH) || undefined,
        timestamp: message?.timestamp,
    };
}

function embedLength(embed: APIEmbed) {
    return (embed.author?.name.length || 0) + (embed.description?.length || 0);
}

export function chunkEmbeds(embeds: APIEmbed[]) {
    return embeds.reduce((chunks: APIEmbed[][], embed) => {
        const last = chunks.at(-1);
        const fits =
            last &&
            last.length < MAX_EMBEDS &&
            [...last, embed].reduce(
                (total, item) => total + embedLength(item),
                0,
            ) <= MAX_EMBEDS_LENGTH;
        return fits
            ? [...chunks.slice(0, -1), [...last, embed]]
            : [...chunks, [embed]];
    }, []);
}
