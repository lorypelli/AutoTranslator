import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { interactions, register } from './routes/index.js';

const app = new Hono();

app.onError((err, ctx) => {
    const status = err instanceof HTTPException ? err.status : 500;
    return ctx.json({ success: false }, status);
});

app.get('/', (ctx) => {
    return ctx.json({ success: true });
});

app.route('/', interactions);
app.route('/register', register);

export default app;
