import {
    type APIInteraction,
    type APIUser,
    CDNRoutes,
    ImageFormat,
    RouteBases,
} from 'discord-api-types/v10';

const SNOWFLAKE_TIMESTAMP_SHIFT = 22n;
const DEFAULT_AVATARS = 6n;

export function getUser(interaction: APIInteraction) {
    return interaction.member?.user || interaction.user || null;
}

export function getUserId(interaction: APIInteraction) {
    return getUser(interaction)?.id || null;
}

export function getDisplayName({ global_name: globalName, username }: APIUser) {
    return globalName || username;
}

export function getAvatarUrl({ id, avatar }: APIUser) {
    if (avatar) {
        return `${RouteBases.cdn}${CDNRoutes.userAvatar(id, avatar, ImageFormat.PNG)}`;
    }
    const index = (BigInt(id) >> SNOWFLAKE_TIMESTAMP_SHIFT) % DEFAULT_AVATARS;
    return `${RouteBases.cdn}/embed/avatars/${index}.png`;
}
