import Joi from "joi";

const authSchema = Joi.string()
    .pattern(/^Bearer /)
    .required();

const createCardSchema = Joi.object({
    id: Joi.number().integer().required(),
    type: Joi.string().required(),
    password: Joi.string().required(),
});

export { authSchema, createCardSchema };
