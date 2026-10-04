import type {
    APIInteractionResponse,
    APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import type { Defer } from './defer.js';

export type Modal = {
    id: string;
    run: (
        interaction: APIModalSubmitInteraction,
        defer: Defer,
        args: string[],
    ) => APIInteractionResponse;
};
