import {
    type APIInteraction,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import {
    ANYWHERE,
    getApplication,
    getCommands,
    getUser,
    sendEmbeds,
    toEmbed,
} from '../../discord/index.js';
import type { Bindings, Command } from '../../types/index.js';
import { getFooterText, getHelpText } from './text.js';

async function sendHelp(interaction: APIInteraction, env: Bindings) {
    const [application, commands] = await Promise.all([
        getApplication(env),
        getCommands(env),
    ]);
    await sendEmbeds(interaction, [
        {
            ...toEmbed(getHelpText(commands), getUser(interaction)),
            footer: {
                text: getFooterText(application),
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
