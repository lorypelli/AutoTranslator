import verifyKey from '@discord-interactions/verify';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { DiscordEnv } from '../types/index.js';

export const verifyDiscord = createMiddleware<DiscordEnv>(async (ctx, next) => {
    const signature = ctx.req.header('X-Signature-Ed25519');
    const timestamp = ctx.req.header('X-Signature-Timestamp');
    const publicKey = process.env.PUBLIC_KEY;
    if (!signature || !timestamp || !publicKey) {
        throw new HTTPException(401);
    }
    const body = await ctx.req.text();
    if (!body) {
        throw new HTTPException(400);
    }
    const isValidRequest = await verifyKey(
        publicKey,
        signature,
        timestamp,
        body,
    );
    if (!isValidRequest) {
        throw new HTTPException(401);
    }
    ctx.set('interaction', JSON.parse(body));
    await next();
});
