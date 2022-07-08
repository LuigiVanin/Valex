import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const requestGuard = (Schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = Schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            return res
                .status(422)
                .send(validation.error.details.map((err) => err.message));
        }
        next();
    };
};

export { requestGuard };
