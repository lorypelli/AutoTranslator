import verifyKey from '@discord-interactions/verify';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import {
    InteractionResponseType,
    InteractionType,
    type APIInteractionResponse as InteractionResponse,
} from 'discord-api-types/v10';
import { COMMANDS } from './cmd/index.js';
import { DiscordEnv, BotEnv } from './types/index.js';

const verifyDiscord = createMiddleware<DiscordEnv>(async (ctx, next) => {
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

const authBot = createMiddleware<BotEnv>(async (ctx, next) => {
    const id = ctx.req.header('X-Application-ID');
    const token = ctx.req.header('X-Bot-Token');
    if (!id || !token) {
        throw new HTTPException(401);
    }
    if (id != process.env.APPLICATION_ID || token != process.env.BOT_TOKEN) {
        throw new HTTPException(403);
    }
    ctx.set('id', id);
    ctx.set('token', token);
    await next();
});

const app = new Hono();

app.onError((err, ctx) => {
    const status = err instanceof HTTPException ? err.status : 500;
    return ctx.json({ success: false }, status);
});

app.get('/', (ctx) => {
    return ctx.json({ success: true });
});

app.post('/', verifyDiscord, (ctx) => {
    const interaction = ctx.get('interaction');
    if (interaction.type == InteractionType.Ping) {
        return ctx.json<InteractionResponse>({
            type: InteractionResponseType.Pong,
        });
    }
    if (interaction.type == InteractionType.ApplicationCommand) {
        const command = COMMANDS.find(
            (cmd) => cmd.data.name == interaction.data.name,
        );
        if (command) {
            ctx.executionCtx.waitUntil(command.run(interaction));
            return ctx.json<InteractionResponse>({
                type: InteractionResponseType.DeferredChannelMessageWithSource,
            });
        }
    }
    throw new HTTPException(400);
});

app.post('/register', authBot, async (ctx) => {
    const id = ctx.get('id');
    const token = ctx.get('token');
    const url = `https://discord.com/api/v10/applications/${id}/commands`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${token}`,
        },
        body: JSON.stringify(COMMANDS.map((command) => command.data)),
    });
    if (!res.ok) {
        throw new HTTPException(500);
    }
    return ctx.json({ success: true });
});

export default app;
