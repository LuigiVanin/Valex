import { Response } from "express";
import RechargeService from "../services/rechargeService";
import HttpError from "../utils/exceptions";
import { CustomRequest } from "../utils/interfaces";
import { RechargeBody } from "../utils/interfaces/recharge";
import { cardIdParamSchema } from "../utils/schemas";
import { StatusCode } from "../utils/statusCode";

class RechargeController {
    static rechage = async (
        req: CustomRequest<RechargeBody>,
        res: Response
    ) => {
        const { amount } = req.body;
        const { cardId } = req.params;

        const validation = cardIdParamSchema.validate(cardId);
        if (validation.error) {
            throw new HttpError(
                StatusCode.BadRequest_400,
                "id de cartão inválido"
            );
        }

        await RechargeService.recharge(validation.value as number, amount);
        return res
            .status(StatusCode.Created_201)
            .send({ msg: `Reacarga de ${amount} efetivada` });
    };
}

export default RechargeController;
