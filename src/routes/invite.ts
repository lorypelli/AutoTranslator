import { OAuth2Routes } from 'discord-api-types/v10';
import { Hono } from 'hono';
import { getBindings } from '../utils/index.js';

export const invite = new Hono();

invite.get('/', (ctx) =>
    ctx.redirect(
        `${OAuth2Routes.authorizationURL}?client_id=${getBindings(ctx).APPLICATION_ID}`,
    ),
);
