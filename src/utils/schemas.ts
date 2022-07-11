import Joi from "joi";

// TODO: use this value on id fields
const itemIdSchema = Joi.number().integer().min(1).required();
const cardIdParamSchema = itemIdSchema;

const authSchema = Joi.string().required();

const createCardSchema = Joi.object({
    id: Joi.number().integer().required(),
    type: Joi.string()
        .equal(
            ...["groceries", "restaurant", "transport", "education", "health"]
        )
        .required(),
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
    cardId: itemIdSchema,
    password: Joi.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
});

const rechargeSchema = Joi.object({
    amount: Joi.number().integer().min(1).required(),
});

const paymentSchema = Joi.object({
    amount: Joi.number().integer().min(1).required(),
    password: Joi.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
    businessId: itemIdSchema,
});

export {
    authSchema,
    createCardSchema,
    activateCardSchema,
    blockCardSchema,
    rechargeSchema,
    cardIdParamSchema,
    paymentSchema,
};
