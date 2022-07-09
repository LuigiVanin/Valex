import { TransactionTypes } from "../../repositories/cardRepository";

export interface CreateCardBody {
    id: number;
    type: TransactionTypes;
}

export interface ActivateCardBody {
    cardId: number;
    cvc: string;
    password: string;
}

export interface BlockCardBody {
    cardId: number;
    password: string;
}
