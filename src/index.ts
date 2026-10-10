import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { chat, interactions, invite, register } from './routes/index.js';
import { UNKNOWN_ERROR } from './utils/index.js';

const app = new Hono();

app.onError((err, ctx) => {
    const status = err instanceof HTTPException ? err.status : 500;
    return ctx.json(
        { success: false, error: err.message || UNKNOWN_ERROR },
        status,
    );
});

app.get('/', (ctx) => ctx.json({ success: true }));

app.route('/', interactions);
app.route('/chat', chat);
app.route('/invite', invite);
app.route('/register', register);

export default app;
