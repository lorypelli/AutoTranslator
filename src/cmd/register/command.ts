import {
    type APIInteraction,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import {
    ANYWHERE,
    getOwnerId,
    getUser,
    getUserId,
    registerCommands,
    sendEmbeds,
    toEmbed,
} from '../../discord/index.js';
import type { Bindings, Command } from '../../types/index.js';
import { COMMANDS } from '../commands.js';
import { NOT_DEVELOPER_ERROR } from './constants.js';

async function register(interaction: APIInteraction, env: Bindings) {
    const ownerId = await getOwnerId(env);
    if (!ownerId || ownerId != getUserId(interaction)) {
        throw new Error(NOT_DEVELOPER_ERROR);
    }
    await registerCommands(
        env,
        COMMANDS.map((command) => command.data),
    );
    await sendEmbeds(interaction, [
        toEmbed(
            `Registered ${COMMANDS.length} commands.`,
            getUser(interaction),
        ),
    ]);
}

export const REGISTER_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'register',
        description: 'Register the commands (developer only)',
    },
    run(interaction, { env, defer }) {
        return defer(register(interaction, env));
    },
};
