"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.cardIdParamSchema = exports.rechargeSchema = exports.blockCardSchema = exports.activateCardSchema = exports.createCardSchema = exports.authSchema = void 0;
var joi_1 = __importDefault(require("joi"));
// TODO: use this value on id fields
var itemIdSchema = joi_1.default.number().integer().min(1).required();
var cardIdParamSchema = itemIdSchema;
exports.cardIdParamSchema = cardIdParamSchema;
var authSchema = joi_1.default.string().required();
exports.authSchema = authSchema;
var createCardSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    type: (_a = joi_1.default.string())
        .equal.apply(_a, ["groceries", "restaurant", "transport", "education", "health"]).required(),
});
exports.createCardSchema = createCardSchema;
var activateCardSchema = joi_1.default.object({
    cardId: joi_1.default.number().integer().required(),
    cvc: joi_1.default.string()
        .length(3)
        .pattern(/^[0-9]*$/)
        .required(),
    password: joi_1.default.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
});
exports.activateCardSchema = activateCardSchema;
var blockCardSchema = joi_1.default.object({
    cardId: itemIdSchema,
    password: joi_1.default.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
});
exports.blockCardSchema = blockCardSchema;
var rechargeSchema = joi_1.default.object({
    amount: joi_1.default.number().integer().min(1).required(),
});
exports.rechargeSchema = rechargeSchema;
var paymentSchema = joi_1.default.object({
    amount: joi_1.default.number().integer().min(1).required(),
    password: joi_1.default.string()
        .length(4)
        .pattern(/^[0-9]*$/)
        .required(),
    businessId: itemIdSchema,
});
exports.paymentSchema = paymentSchema;
