import { Hono } from 'hono';
import type { AppEnv } from '../types/index.js';
import { GITHUB_URL } from '../utils/index.js';

export const github = new Hono<AppEnv>();

github.get('/', (ctx) => ctx.redirect(GITHUB_URL));
