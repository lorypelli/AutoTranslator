import type {
    APIInteractionResponse,
    APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import type { Runtime } from './runtime.js';

export type Modal = {
    id: string;
    run: (
        interaction: APIModalSubmitInteraction,
        runtime: Runtime,
        args: string[],
    ) => APIInteractionResponse;
};
