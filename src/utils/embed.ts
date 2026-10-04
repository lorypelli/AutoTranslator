import {
    CDNRoutes,
    ImageFormat,
    RouteBases,
    type APIEmbed,
    type APIMessage,
    type APIUser,
} from 'discord-api-types/v10';

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

export function toEmbed(message: APIMessage): APIEmbed {
    const { author } = message;
    return {
        author: {
            name: author.global_name ?? author.username,
            icon_url: getAvatarUrl(author),
        },
        description: message.content || undefined,
        timestamp: message.timestamp,
    };
}
