"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var rechargeController_1 = __importDefault(require("../controllers/rechargeController"));
var auth_1 = __importDefault(require("../middlewares/auth"));
var validation_1 = require("../middlewares/validation");
var schemas_1 = require("../utils/schemas");
var rechargeRouter = (0, express_1.Router)();
rechargeRouter.post("/:cardId", (0, validation_1.requestGuard)(schemas_1.rechargeSchema), auth_1.default, rechargeController_1.default.rechage);
exports.default = rechargeRouter;
