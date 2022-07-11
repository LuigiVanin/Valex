"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cardController_1 = __importDefault(require("../controllers/cardController"));
var auth_1 = __importDefault(require("../middlewares/auth"));
var validation_1 = require("../middlewares/validation");
var schemas_1 = require("../utils/schemas");
var cardRouter = (0, express_1.Router)();
cardRouter.post("/create", (0, validation_1.requestGuard)(schemas_1.createCardSchema), auth_1.default, cardController_1.default.createCard);
cardRouter.patch("/activate", (0, validation_1.requestGuard)(schemas_1.activateCardSchema), auth_1.default, cardController_1.default.activateCard);
cardRouter.patch("/block", (0, validation_1.requestGuard)(schemas_1.blockCardSchema), auth_1.default, cardController_1.default.blockCard);
cardRouter.patch("/unblock", (0, validation_1.requestGuard)(schemas_1.blockCardSchema), auth_1.default, cardController_1.default.unblockCard);
cardRouter.get("/:cardId", auth_1.default, cardController_1.default.viewBalance);
exports.default = cardRouter;
