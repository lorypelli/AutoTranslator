import {
    type RESTPutAPIApplicationCommandsJSONBody,
    Routes,
} from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';
import { botRequest } from './rest.js';

export async function registerCommands(
    env: Bindings,
    commands: RESTPutAPIApplicationCommandsJSONBody,
) {
    await botRequest(
        env,
        Routes.applicationCommands(env.APPLICATION_ID),
        'Could not register the commands.',
        { method: 'PUT', body: JSON.stringify(commands) },
    );
}
