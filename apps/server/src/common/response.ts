export class Responder<T> {
    data: T | undefined = undefined;
    status_code: number = 0;
    message: string = "";
    error: unknown = null;
    success: boolean = false;

    constructor(data: T, success: boolean, msg: string) {
        this.data = data;
        this.success = success;
        this.message = msg;
    }

    make() {
        return new Response(JSON.stringify(this), {
            status: this.status_code,
        });
    }

    setStatus(status: number) {
        this.status_code = status;
        return this;
    }

    setMessage(msg: string) {
        this.message = msg;
        return this;
    }

    setError(error: unknown | Error) {
        this.error = JSON.stringify(error);
        this.status_code = 401;
        this.success = false;
        return this;
    }
}

export const OkResponse = <T>(data: T) => {
    return new Responder(data, true, "successful request").setStatus(200);
};

export const ErrResponse = <T>(
    data: T,
    msg: string,
    error: unknown | Error,
) => {
    return new Responder(data, true, msg).setError(error);
};
