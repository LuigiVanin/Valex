import bcrypt from "bcrypt";
import {
    findByTypeAndEmployeeId,
    insert,
    findById as findCardById,
    TransactionTypes,
    update,
} from "../repositories/cardRepository";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";
import { formatName, generateDigits, generateExpDate } from "../utils/utils";
import "../config/setup";
import { findById } from "../repositories/employeeRepository";

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

    private static checkCardPassword = (
        password: string,
        hash: string | undefined
    ) => {
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
        const card = {
            employeeId: employee.id,
            isVirtual: false,
            securityCode: generateDigits(3),
            expirationDate: generateExpDate(5),
            type,
            cardholderName: formatName(employee.fullName),
            number: generateDigits(16),
            isBlocked: false,
        };

        await insert(card);
        return card;
    };

    // TODO: checar expiração
    static activateCard = async (
        cardId: number,
        cvc: string,
        password: string
    ) => {
        const card = await CardService.getCardOrError404(cardId);
        if (card.securityCode !== cvc) {
            throw new HttpError(StatusCode.Forbidden_403, "CVC incorreto");
        }
        if (!!card.password) {
            throw new HttpError(StatusCode.OK_200, "Cartão já foi ativado");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await update(cardId, { password: hashedPassword });
    };

    // TODO: checar expiração
    static blockCard = async (cardId: number, password: string) => {
        const card = await CardService.getCardOrError404(cardId);
        CardService.checkCardPassword(password, card.password);
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
        if (!card.isBlocked) {
            throw new HttpError(
                StatusCode.Conflict_409,
                "O cartão não está bloqueado"
            );
        }

        await update(cardId, { isBlocked: false });
    };
}

export default CardService;
