import {
    type APIApplication,
    type APIApplicationCommand,
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';

function getSlashCommandLines({
    id,
    name,
    description,
    options = [],
}: APIApplicationCommand) {
    const subcommands = options.filter(
        (option) => option.type == ApplicationCommandOptionType.Subcommand,
    );
    if (!subcommands.length) {
        return [`</${name}:${id}> - ${description}`];
    }
    return subcommands.map(
        (subcommand) =>
            `</${name} ${subcommand.name}:${id}> - ${subcommand.description}`,
    );
}

function getCommandLines(command: APIApplicationCommand) {
    if (command.type == ApplicationCommandType.User) {
        return [`Right click a user, then **Apps** → **${command.name}**`];
    }
    if (command.type == ApplicationCommandType.Message) {
        return [`Right click a message, then **Apps** → **${command.name}**`];
    }
    return getSlashCommandLines(command);
}

export function getHelpText(commands: APIApplicationCommand[]) {
    return commands
        .toSorted((a, b) => a.type - b.type || a.name.localeCompare(b.name))
        .flatMap((command) => getCommandLines(command))
        .join('\n');
}

export function getFooterText({
    approximate_guild_count: servers = 0,
    approximate_user_install_count: users = 0,
}: APIApplication) {
    return `Added to ${servers} ${servers == 1 ? 'server' : 'servers'} and installed by ${users} ${users == 1 ? 'user' : 'users'}`;
}
