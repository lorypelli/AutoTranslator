import { Hono } from 'hono';
import { getInviteUrl } from '../discord/index.js';
import { getBindings } from '../utils/index.js';

export const invite = new Hono();

invite.get('/', (ctx) => ctx.redirect(getInviteUrl(getBindings(ctx))));
