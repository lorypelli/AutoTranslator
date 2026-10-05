import verifyKey from '@discord-interactions/verify';
import type { APIInteraction } from 'discord-api-types/v10';
import { env } from 'hono/adapter';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { Bindings, DiscordEnv } from '../types/index.js';

export const verifyDiscord = createMiddleware<DiscordEnv>(async (ctx, next) => {
    const signature = ctx.req.header('X-Signature-Ed25519');
    const timestamp = ctx.req.header('X-Signature-Timestamp');
    const { PUBLIC_KEY } = env<Bindings>(ctx);
    if (!signature || !timestamp || !PUBLIC_KEY) {
        throw new HTTPException(401);
    }
    const body = await ctx.req.text();
    if (!body) {
        throw new HTTPException(400);
    }
    const isValidRequest = await verifyKey(
        PUBLIC_KEY,
        signature,
        timestamp,
        body,
    );
    if (!isValidRequest) {
        throw new HTTPException(401);
    }
    const interaction: APIInteraction = JSON.parse(body);
    ctx.set('interaction', interaction);
    await next();
});
