import { Router } from "express";
import CardController from "../controllers/cardController";
import { requestGuard } from "../middlewares/validation";
import { createCardSchema } from "../utils/schemas";

const cardRouter = Router();

cardRouter.post(
    "/card",
    requestGuard(createCardSchema),
    CardController.createCard
);

export default cardRouter;
