import verifyKey from '@discord-interactions/verify';
import type { APIInteraction } from 'discord-api-types/v10';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { DiscordEnv } from '../types/index.js';
import { getBindings } from '../utils/index.js';

export const verifyDiscord = createMiddleware<DiscordEnv>(async (ctx, next) => {
    const signature = ctx.req.header('X-Signature-Ed25519');
    const timestamp = ctx.req.header('X-Signature-Timestamp');
    const { PUBLIC_KEY } = getBindings(ctx);
    if (!signature || !timestamp || !PUBLIC_KEY) {
        throw new HTTPException(401, {
            message: 'The request signature is missing.',
        });
    }
    const body = await ctx.req.text();
    if (!body) {
        throw new HTTPException(400, {
            message: 'The request body is missing.',
        });
    }
    const isValidRequest = await verifyKey(
        PUBLIC_KEY,
        signature,
        timestamp,
        body,
    );
    if (!isValidRequest) {
        throw new HTTPException(401, {
            message: 'The request signature is invalid.',
        });
    }
    const interaction: APIInteraction = JSON.parse(body);
    ctx.set('interaction', interaction);
    await next();
});
