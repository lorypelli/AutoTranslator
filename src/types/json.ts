export type JsonObject = {
    [key: string]: Json;
};

export type Json = string | number | boolean | null | Json[] | JsonObject;

declare global {
    interface JSON {
        parse<T = Json>(text: string): NoInfer<T>;
    }

    interface Body {
        json<T = Json>(): Promise<NoInfer<T>>;
    }
}
