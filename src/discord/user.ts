import {
    type APIInteraction,
    type APIUser,
    CDNRoutes,
    ImageFormat,
    RouteBases,
} from 'discord-api-types/v10';

const SNOWFLAKE_TIMESTAMP_SHIFT = 22n;
const DEFAULT_AVATARS = 6n;

export function getUserId(interaction: APIInteraction) {
    return interaction.member?.user.id || interaction.user?.id || null;
}

export function getDisplayName(user: APIUser) {
    return user.global_name || user.username;
}

export function getAvatarUrl(user: APIUser) {
    if (user.avatar) {
        return `${RouteBases.cdn}${CDNRoutes.userAvatar(user.id, user.avatar, ImageFormat.PNG)}`;
    }
    const index =
        (BigInt(user.id) >> SNOWFLAKE_TIMESTAMP_SHIFT) % DEFAULT_AVATARS;
    return `${RouteBases.cdn}/embed/avatars/${index}.png`;
}
