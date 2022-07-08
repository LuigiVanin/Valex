class HttpError extends Error {
    constructor(
        public statusCode: number,
        public details: string,
        msg: string | undefined
    ) {
        super(msg);
    }
}

export default HttpError;
