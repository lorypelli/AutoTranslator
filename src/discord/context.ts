import {
    type APIInteraction,
    ApplicationIntegrationType,
    InteractionContextType,
} from 'discord-api-types/v10';

export const ANYWHERE = {
    integration_types: [
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
    ],
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel,
    ],
};

export const WITH_BOT = {
    integration_types: [ApplicationIntegrationType.GuildInstall],
    contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
};

export function getReadableChannelId({
    authorizing_integration_owners: owners,
    channel,
}: APIInteraction) {
    if (!owners[ApplicationIntegrationType.GuildInstall]) {
        return null;
    }
    return channel?.id || null;
}
