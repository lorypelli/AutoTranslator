import type { APIInteraction } from 'discord-api-types/v10';

export type DiscordEnv = {
    Variables: {
        interaction: APIInteraction;
    };
};

export type BotEnv = {
    Variables: {
        id: string;
        token: string;
    };
};
