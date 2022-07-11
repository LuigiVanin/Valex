import { insert } from "../repositories/rechargeRepository";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";
import CardService from "./cardService";

class RechargeService {
    static recharge = async (cardId: number, amount: number) => {
        const card = await CardService.getCardOrError404(cardId);
        CardService.checkActiveOr403(card.password);
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
