import type {
    APIApplicationCommandInteraction as CommandInteraction,
    APIInteraction as Interaction,
    RESTPostAPIApplicationCommandsJSONBody as ApplicationCommand,
} from 'discord-api-types/v10';

export type Command = {
    data: ApplicationCommand;
    run: (interaction: CommandInteraction) => Promise<void>;
};

export type DiscordEnv = {
    Variables: {
        interaction: Interaction;
    };
};
export type BotEnv = {
    Variables: {
        id: string;
        token: string;
    };
};
