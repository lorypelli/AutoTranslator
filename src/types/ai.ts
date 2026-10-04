export type AiMessage = {
    role: 'system' | 'user';
    content: string;
};

export type AiPayload = {
    response_format: { type: 'json_object' };
    messages: AiMessage[];
};

export type AiCompletion = {
    choices?: { message?: { content?: string } }[];
};

export type Ai = {
    run: (model: string, payload: AiPayload) => Promise<AiCompletion>;
};
