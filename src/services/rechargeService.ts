import {
    findByCardId,
    insert,
    Recharge,
} from "../repositories/rechargeRepository";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";
import CardService from "./cardService";

class RechargeService {
    static getRechargesBalance = async (
        cardId: number
    ): Promise<[Recharge[], number]> => {
        const recharges = await findByCardId(cardId);
        const totalRecharges = recharges.reduce<number>((acc, recharge) => {
            return acc + recharge.amount;
        }, 0);
        return [recharges, totalRecharges];
    };

    static recharge = async (cardId: number, amount: number) => {
        const card = await CardService.getCardOrError404(cardId);

        CardService.checkActiveOr403(card.password);
        CardService.checkExpDateOrError403(card.expirationDate);

        if (card.isBlocked) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                "Cartão está bloqueado"
            );
        }
        await insert({ amount, cardId });
    };
}

export default RechargeService;
