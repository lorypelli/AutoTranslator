import type { APIInteractionResponse } from 'discord-api-types/v10';
import type { Bindings } from './env.js';

export type Runtime = {
    env: Bindings;
    defer: (work: Promise<void>) => APIInteractionResponse;
};
