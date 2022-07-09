import { Response } from "express";
import CardService from "../services/cardService";
import { CustomRequest } from "../utils/interfaces";
import {
    ActivateCardBody,
    BlockCardBody,
    CreateCardBody,
} from "../utils/interfaces/card";
import { StatusCode } from "../utils/statusCode";

class CardController {
    static createCard = async (
        req: CustomRequest<CreateCardBody>,
        res: Response
    ) => {
        const { id, type } = req.body;

        const card = await CardService.createCard(id, type);
        return res.status(201).send(card);
    };

    static activateCard = async (
        req: CustomRequest<ActivateCardBody>,
        res: Response
    ) => {
        const { cardId, cvc, password } = req.body;
        console.log(req.body);
        await CardService.activateCard(cardId, cvc, password);
        return res
            .status(StatusCode.Created_201)
            .send({ msg: "Cartão ativdado" });
    };

    static blockCard = async (
        req: CustomRequest<BlockCardBody>,
        res: Response
    ) => {
        const { cardId, password } = req.body;
        await CardService.blockCard(cardId, password);
        res.status(201).send({ msg: "blocked" });
    };
}

export default CardController;
