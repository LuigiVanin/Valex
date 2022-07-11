import bcrypt from "bcrypt";
import Cryptr from "cryptr";
import "../config/setup";
import {
    findByTypeAndEmployeeId,
    insert,
    findById as findCardById,
    TransactionTypes,
    update,
} from "../repositories/cardRepository";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";
import {
    formatName,
    generateDigits,
    generateExpDate,
    isCardExpired,
} from "../utils/utils";
import "../config/setup";
import { findById } from "../repositories/employeeRepository";
import { cardIdParamSchema } from "../utils/schemas";
import PaymentService from "./paymentService";
import RechargeService from "./rechargeService";

class CardService {
    static getCardOrError404 = async (cardId: number) => {
        const card = await findCardById(cardId);
        if (!card) {
            throw new HttpError(
                StatusCode.NotFound_404,
                "Cartão não encontrado"
            );
        }

        return card;
    };

    static checkActiveOr403 = (dbPassword: string | undefined) => {
        if (!dbPassword) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                "O cartão ainda não foi ativado"
            );
        }
        return dbPassword as string;
    };

    static checkExpDateOrError403 = (expDate: string) => {
        if (isCardExpired(expDate)) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                `Cartão já expirado! expDate: ${expDate}`
            );
        }
    };

    static validateCardId = (cardId: string | number | undefined) => {
        const validation = cardIdParamSchema.validate(cardId);
        if (validation.error) {
            throw new HttpError(
                StatusCode.BadRequest_400,
                "id de cartão inválido"
            );
        }
        return validation.value as number;
    };

    static authenticateCard = (password: string, hash: string | undefined) => {
        hash = CardService.checkActiveOr403(hash);
        if (!bcrypt.compareSync(password, hash)) {
            throw new HttpError(
                StatusCode.Forbidden_403,
                "A senha do cartão esta incorreta!"
            );
        }
    };

    static createCard = async (id: number, type: TransactionTypes) => {
        const [employee, haveSameType] = await Promise.all([
            findById(id),
            findByTypeAndEmployeeId(type, id),
        ]);
        if (!employee) {
            throw new HttpError(
                StatusCode.NotFound_404,
                `Id ${id} de usuário não encontrado`,
                "Falha ao encontrar usuário"
            );
        }
        if (!!haveSameType) {
            throw new HttpError(
                StatusCode.Conflict_409,
                `usuário já tem cartão do tipo ${type}`,
                "Falha em criar cartão, tipo já existente"
            );
        }

        const key = process.env.KEY || "my super super key";
        console.log(key);
        const crpt = new Cryptr(key);
        const card = {
            employeeId: employee.id,
            isVirtual: false,
            securityCode: crpt.encrypt(generateDigits(3)),
            expirationDate: generateExpDate(5),
            type,
            cardholderName: formatName(employee.fullName),
            number: generateDigits(16),
            isBlocked: false,
        };

        await insert(card);
        return {
            ...card,
            securityCode: crpt.decrypt(card.securityCode),
        };
    };

    static activateCard = async (
        cardId: number,
        cvc: string,
        password: string
    ) => {
        const card = await CardService.getCardOrError404(cardId);
        const key = process.env.KEY || "my super super key";
        const crpt = new Cryptr(key);
        const decodedCvc = crpt.decrypt(card.securityCode);
        if (decodedCvc !== cvc) {
            throw new HttpError(StatusCode.Forbidden_403, "CVC incorreto");
        }
        if (!!card.password) {
            throw new HttpError(StatusCode.OK_200, "Cartão já foi ativado");
        }
        CardService.checkExpDateOrError403(card.expirationDate);
        const hashedPassword = await bcrypt.hash(password, 10);
        await update(cardId, { password: hashedPassword });
    };

    // TODO: checar expiração
    static blockCard = async (cardId: number, password: string) => {
        const card = await CardService.getCardOrError404(cardId);

        CardService.authenticateCard(password, card.password);
        CardService.checkExpDateOrError403(card.expirationDate);

        if (card.isBlocked) {
            throw new HttpError(
                StatusCode.Conflict_409,
                "O cartão já foi bloqueado"
            );
        }

        await update(cardId, { isBlocked: true });
    };

    static unblockCard = async (cardId: number, password: string) => {
        const card = await CardService.getCardOrError404(cardId);

        CardService.authenticateCard(password, card.password);
        CardService.checkExpDateOrError403(card.expirationDate);

        if (!card.isBlocked) {
            throw new HttpError(
                StatusCode.Conflict_409,
                "O cartão não está bloqueado"
            );
        }

        await update(cardId, { isBlocked: false });
    };

    static getCardBalance = async (cardId: number) => {
        const [[recharges, totalRecharges], [payments, totalPayments]] =
            await Promise.all([
                RechargeService.getRechargesBalance(cardId),
                PaymentService.getPaymentBalance(cardId),
            ]);

        return {
            balance: totalRecharges - totalPayments,
            transactions: payments,
            recharges,
        };
    };
}

export default CardService;
