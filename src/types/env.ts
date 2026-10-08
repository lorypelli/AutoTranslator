import type { APIInteraction } from 'discord-api-types/v10';
import type { Ai } from './ai.js';
import type { Kv } from './kv.js';

export type Bindings = {
    PUBLIC_KEY: string;
    APPLICATION_ID: string;
    BOT_TOKEN: string;
    AI: Ai;
    LANGUAGES: Kv;
};

export type DiscordEnv = {
    Variables: {
        interaction: APIInteraction;
    };
};

export type ChatEnv = {
    Variables: {
        language: string;
        messages: string[];
    };
};
