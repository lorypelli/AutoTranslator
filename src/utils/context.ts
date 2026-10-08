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

export function getReadableChannelId(interaction: APIInteraction) {
    return interaction.authorizing_integration_owners[
        ApplicationIntegrationType.GuildInstall
    ]
        ? (interaction.channel?.id ?? null)
        : null;
}
