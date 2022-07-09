import { Router } from "express";
import CardController from "../controllers/cardController";
import authentication from "../middlewares/auth";
import { requestGuard } from "../middlewares/validation";
import {
    activateCardSchema,
    blockCardSchema,
    createCardSchema,
} from "../utils/schemas";

const cardRouter = Router();

cardRouter.post(
    "/create",
    requestGuard(createCardSchema),
    authentication,
    CardController.createCard
);
cardRouter.patch(
    "/activate",
    requestGuard(activateCardSchema),
    authentication,
    CardController.activateCard
);
cardRouter.patch(
    "/block",
    requestGuard(blockCardSchema),
    authentication,
    CardController.blockCard
);

export default cardRouter;
