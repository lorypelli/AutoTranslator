import type { Bindings, JsonObject } from '../types/index.js';
import { orNullWithin, parseJsonObject } from '../utils/index.js';

const MODEL = '@cf/google/gemma-4-26b-a4b-it';
const ATTEMPT_TIMEOUT_MS = 12000;

export async function ask(
    env: Bindings,
    prompt: string,
    input: JsonObject,
    retry = true,
) {
    const request = env.AI.run(MODEL, {
        response_format: { type: 'json_object' },
        chat_template_kwargs: { enable_thinking: false },
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: JSON.stringify(input) },
        ],
    });
    const completion = await orNullWithin(request, ATTEMPT_TIMEOUT_MS);
    if (completion) {
        const [choice] = completion.choices ?? [];
        return parseJsonObject(choice?.message?.content || '');
    }
    if (retry) {
        return ask(env, prompt, input, false);
    }
    throw new Error('The AI request failed, try again later.');
}
