import { Response } from "express";
import CardService from "../services/cardService";
import PaymentService from "../services/paymentService";
import { CustomRequest } from "../utils/interfaces";
import { PaymentBody } from "../utils/interfaces/payment";
import { StatusCode } from "../utils/statusCode";

class PaymentController {
    static purchase = async (
        req: CustomRequest<PaymentBody>,
        res: Response
    ) => {
        console.log(req.body);
        const { amount, password, businessId } = req.body;
        const { cardId } = req.params;

        const cardIdValue = CardService.validateCardId(cardId);
        await PaymentService.purchase(
            cardIdValue,
            password,
            amount,
            businessId
        );
        res.status(StatusCode.Created_201).send({ msg: "" });
    };
}

export default PaymentController;
