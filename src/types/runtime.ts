import type { APIInteractionResponse } from 'discord-api-types/v10';
import type { Bindings } from './env.js';

export type Defer = (work: Promise<void>) => APIInteractionResponse;

export type Runtime = {
    env: Bindings;
    defer: Defer;
};
