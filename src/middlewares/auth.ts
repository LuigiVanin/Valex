import { NextFunction, Request, Response } from "express";
import { authSchema } from "../utils/schemas";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";
import { findByApiKey } from "../repositories/companyRepository";

const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { "x-api-key": apiKey } = req.headers;
    const validation = authSchema.validate(apiKey);
    if (validation.error) {
        throw new HttpError(
            StatusCode.BadRequest_400,
            "Api key não enviada ou mal formatada!"
        );
    }
    const company = await findByApiKey(apiKey as string);
    if (!company) {
        throw new HttpError(
            StatusCode.Anauthorized_401,
            "Api Key não autorizada!",
            "Erro de autorização"
        );
    }

    res.locals.company = company;
    next();
};

export default authentication;
