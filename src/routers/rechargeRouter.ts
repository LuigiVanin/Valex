import { Router } from "express";
import RechargeController from "../controllers/rechargeController";
import authentication from "../middlewares/auth";
import { requestGuard } from "../middlewares/validation";
import { rechargeSchema } from "../utils/schemas";

const rechargeRouter = Router();

rechargeRouter.post(
    "/:cardId",
    requestGuard(rechargeSchema),
    authentication,
    RechargeController.rechage
);

export default rechargeRouter;
