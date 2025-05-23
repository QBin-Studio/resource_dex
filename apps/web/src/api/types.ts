export type FromReturnedPromise<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer U> ? U : never;

export type SResponse<T = undefined> = {
    data: T | undefined;
    message: string;
    error: unknown;
    success: boolean;
    status_code: number;
};
