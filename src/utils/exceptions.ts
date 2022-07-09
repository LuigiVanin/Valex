class HttpError extends Error {
    constructor(
        public statusCode: number,
        public details: string,
        msg?: string
    ) {
        let message =
            msg == undefined
                ? "Erro de processamento com retorno em Http"
                : msg;
        super(message);
    }
}

export default HttpError;
