import { Router } from "express";
import PaymentController from "../controllers/paymentCotroller";
import authentication from "../middlewares/auth";
import { requestGuard } from "../middlewares/validation";
import { paymentSchema } from "../utils/schemas";

const paymentRouter = Router();
paymentRouter.post(
    "/:cardId",
    requestGuard(paymentSchema),
    authentication,
    PaymentController.purchase
);

export default paymentRouter;
