import {
    type APIApplication,
    type APIApplicationCommand,
    OAuth2Routes,
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
        {
            method: 'PUT',
            body: JSON.stringify(commands),
        },
    );
}

export async function getCommands(env: Bindings) {
    const res = await botRequest(
        env,
        Routes.applicationCommands(env.APPLICATION_ID),
        'Could not fetch the commands.',
    );
    const commands: APIApplicationCommand[] = await res.json();
    return commands;
}

export async function getApplication(env: Bindings) {
    const res = await botRequest(
        env,
        Routes.currentApplication(),
        'Could not fetch the application.',
    );
    const application: APIApplication = await res.json();
    return application;
}

export async function getOwnerId(env: Bindings) {
    const { team } = await getApplication(env);
    return team?.owner_user_id || null;
}

export function getInviteUrl({ APPLICATION_ID }: Bindings) {
    return `${OAuth2Routes.authorizationURL}?client_id=${APPLICATION_ID}`;
}
