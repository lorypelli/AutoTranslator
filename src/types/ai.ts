export type AiMessage = {
    role: 'system' | 'user';
    content: string;
};

export type AiPayload = {
    response_format: { type: 'json_object' };
    chat_template_kwargs: { enable_thinking: boolean };
    messages: AiMessage[];
};

export type AiCompletion = {
    choices?: { message?: { content?: string | null } }[];
};

export type Ai = {
    run: (model: string, payload: AiPayload) => Promise<AiCompletion>;
};
