import type { APIInteraction } from 'discord-api-types/v10';

export type Bindings = {
    PUBLIC_KEY: string;
    APPLICATION_ID: string;
    BOT_TOKEN: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_API_TOKEN: string;
};

export type DiscordEnv = {
    Variables: {
        interaction: APIInteraction;
    };
};

export type RequestEnv = {
    Variables: {
        language: string;
        messages: string[];
    };
};
