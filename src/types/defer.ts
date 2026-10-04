import type { APIInteractionResponse } from 'discord-api-types/v10';

export type Defer = (work: Promise<void>) => APIInteractionResponse;
