import { TransactionTypes } from "../../repositories/cardRepository";

export interface CreateCardBody {
    id: number;
    type: TransactionTypes;
    password: string;
}
