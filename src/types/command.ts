import type {
    APIApplicationCommandAutocompleteInteraction,
    APIApplicationCommandAutocompleteResponse,
    APIApplicationCommandInteraction,
    APIApplicationCommandSubcommandOption,
    APIInteractionResponse,
    RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import type { Runtime } from './runtime.js';

export type Command = {
    data: RESTPostAPIApplicationCommandsJSONBody;
    run: (
        interaction: APIApplicationCommandInteraction,
        runtime: Runtime,
    ) => APIInteractionResponse;
    autocomplete?: (
        interaction: APIApplicationCommandAutocompleteInteraction,
        runtime: Runtime,
    ) => Promise<APIApplicationCommandAutocompleteResponse>;
};

export type Subcommand = {
    data: APIApplicationCommandSubcommandOption;
    run: (
        interaction: APIApplicationCommandInteraction,
        runtime: Runtime,
    ) => APIInteractionResponse;
};
