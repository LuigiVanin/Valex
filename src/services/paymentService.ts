import { Business, findById } from "../repositories/businessRepository";
import { Card } from "../repositories/cardRepository";
import {
    findByCardId,
    insert,
    PaymentWithBusinessName,
} from "../repositories/paymentRepository";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";
import CardService from "./cardService";

class PaymentService {
    static getPaymentBalance = async (
        cardId: number
    ): Promise<[PaymentWithBusinessName[], number]> => {
        const payments = await findByCardId(cardId);
        const totalPayment = payments.reduce<number>((acc, item) => {
            return acc + item.amount;
        }, 0);

        return [payments, totalPayment];
    };

    static purchase = async (
        cardId: number,
        password: string,
        amount: number,
        businessId: number
    ) => {
        const [card, business] = await Promise.all([
            CardService.getCardOrError404(cardId),
            findById(businessId),
        ]);

        CardService.authenticateCard(password, card.password);
        CardService.checkExpDateOrError403(card.expirationDate);

        if (card.isBlocked) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                "Cartão está bloqueado!"
            );
        }
        if (!business) {
            throw new HttpError(
                StatusCode.NotFound_404,
                "O estabelicimento não pôde ser encontrado"
            );
        }
        if (business.type !== card.type) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                `Os tipos de cartão são distintos: cartão ${card.type} não pode ser usado com ${business.type}`
            );
        }
        const { balance } = await CardService.getCardBalance(cardId);
        if (balance < amount) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                "A quantidade a ser gasta é maior que a quantidade que o usuário possui"
            );
        }
        await insert({ amount, businessId, cardId });
    };
}

export default PaymentService;
