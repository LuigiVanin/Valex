import db from "../config/database";
import {
    findByTypeAndEmployeeId,
    insert,
    TransactionTypes,
} from "../repositories/cardRepository";
import { findById } from "../repositories/employeeRepository";
import HttpError from "../utils/exceptions";
import { StatusCode } from "../utils/statusCode";

class CardService {
    static createCard = async (
        apikey: string | string[] | undefined,
        id: number,
        type: TransactionTypes,
        password: string
    ) => {
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
                StatusCode.Conflict_304,
                `usuário já tem cartão do tipo ${type}`,
                "Falha em criar cartão, tipo já existente"
            );
        }

        await insert({
            employeeId: employee.id,
            isVirtual: false,
            securityCode: "123",
            expirationDate: "",
            type,
            password,
            cardholderName: employee.fullName,
            number: "123",
            isBlocked: false,
        });
        return;
    };
}

export default CardService;
