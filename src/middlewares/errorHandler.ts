import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/exceptions";

const errorHandler = async (
    error: HttpError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!(error instanceof HttpError)) {
        console.log(error);
        return res.sendStatus(500);
    }
    return res.status(error.statusCode).send({ details: error.details });
};

export default errorHandler;
