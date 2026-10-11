import {
    type APIInteraction,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import {
    ANYWHERE,
    getApplication,
    getUser,
    sendEmbeds,
    toEmbed,
} from '../../discord/index.js';
import type { Bindings, Command } from '../../types/index.js';
import { HELP_TEXT } from './constants.js';

function getFooterText(servers: number, users: number) {
    return `Added to ${servers} ${servers == 1 ? 'server' : 'servers'} and installed by ${users} ${users == 1 ? 'user' : 'users'}`;
}

async function sendHelp(interaction: APIInteraction, env: Bindings) {
    const {
        approximate_guild_count: servers = 0,
        approximate_user_install_count: users = 0,
    } = await getApplication(env);
    await sendEmbeds(interaction, [
        {
            ...toEmbed(HELP_TEXT, getUser(interaction)),
            footer: {
                text: getFooterText(servers, users),
            },
        },
    ]);
}

export const HELP_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'help',
        description: 'Show what the bot can do',
    },
    run(interaction, { env, defer }) {
        return defer(sendHelp(interaction, env));
    },
};
