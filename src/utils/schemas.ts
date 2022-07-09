import Joi from "joi";

const authSchema = Joi.string().required();

const createCardSchema = Joi.object({
    id: Joi.number().integer().required(),
    type: Joi.string().required(),
});

const activateCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    cvc: Joi.string()
        .length(3)
        .pattern(/^[0-9]*$/)
        .required(),
    password: Joi.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
});

const blockCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    password: Joi.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
});

export { authSchema, createCardSchema, activateCardSchema, blockCardSchema };
