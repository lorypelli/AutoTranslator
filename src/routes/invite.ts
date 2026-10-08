import { OAuth2Routes } from 'discord-api-types/v10';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import type { Bindings } from '../types/index.js';

export const invite = new Hono();

invite.get('/', (ctx) =>
    ctx.redirect(
        `${OAuth2Routes.authorizationURL}?client_id=${env<Bindings>(ctx).APPLICATION_ID}`,
    ),
);
