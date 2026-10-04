import type { APIInteraction } from 'discord-api-types/v10';
import type { Ai } from './ai.js';

export type Bindings = {
    PUBLIC_KEY: string;
    APPLICATION_ID: string;
    BOT_TOKEN: string;
    AI: Ai;
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
