import type {
    APIApplicationCommandInteraction,
    APIInteractionResponse,
    RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import type { Defer } from './defer.js';

export type Command = {
    data: RESTPostAPIApplicationCommandsJSONBody;
    run: (
        interaction: APIApplicationCommandInteraction,
        defer: Defer,
    ) => APIInteractionResponse;
};
