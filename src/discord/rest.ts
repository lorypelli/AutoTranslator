import { RouteBases } from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';

export async function request(
    route: string,
    errorMessage: string,
    init?: RequestInit,
) {
    const res = await fetch(`${RouteBases.api}${route}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!res.ok) {
        throw new Error(errorMessage);
    }
    return res;
}

export function botRequest(
    env: Bindings,
    route: string,
    errorMessage: string,
    init?: RequestInit,
) {
    return request(route, errorMessage, {
        ...init,
        headers: { Authorization: `Bot ${env.BOT_TOKEN}` },
    });
}
