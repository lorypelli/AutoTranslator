import { setTimeout } from 'node:timers/promises';

const TIMEOUT_MS = 25000;

async function timeout(): Promise<never> {
    await setTimeout(TIMEOUT_MS);
    throw new Error('The AI took too long, try with fewer messages.');
}

export function withTimeout<T>(work: Promise<T>) {
    return Promise.race([work, timeout()]);
}
