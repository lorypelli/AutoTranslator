import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { interactions, register, request } from './routes/index.js';

const app = new Hono();

app.onError((err, ctx) => {
    const status = err instanceof HTTPException ? err.status : 500;
    return ctx.json(
        { success: false, error: err.message || undefined },
        status,
    );
});

app.get('/', (ctx) => ctx.json({ success: true }));

app.route('/', interactions);
app.route('/register', register);
app.route('/request', request);

export default app;
