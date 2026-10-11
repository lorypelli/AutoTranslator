import { setTimeout } from 'node:timers/promises';
import { RouteBases } from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';

const RATE_LIMITED = 429;
const DEFAULT_RETRY_AFTER_MS = 1500;

function getRetryAfter(res: Response) {
    const seconds = parseFloat(res.headers.get('Retry-After') || '');
    return seconds * 1000 || DEFAULT_RETRY_AFTER_MS;
}

export async function request(
    route: string,
    errorMessage: string,
    init?: RequestInit,
    retry = true,
) {
    const res = await fetch(`${RouteBases.api}${route}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });
    if (res.status == RATE_LIMITED && retry) {
        await setTimeout(getRetryAfter(res));
        return request(route, errorMessage, init, false);
    }
    if (!res.ok) {
        throw new Error(errorMessage);
    }
    return res;
}

export function botRequest(
    { BOT_TOKEN }: Bindings,
    route: string,
    errorMessage: string,
    init?: RequestInit,
) {
    return request(route, errorMessage, {
        ...init,
        headers: {
            Authorization: `Bot ${BOT_TOKEN}`,
            ...init?.headers,
        },
    });
}
