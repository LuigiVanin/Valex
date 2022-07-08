import { Response } from "express";
import CardService from "../services/cardService";
import { CustomRequest } from "../utils/interfaces";
import { CreateCardBody } from "../utils/interfaces/card";

class CardController {
    static createCard = async (
        req: CustomRequest<CreateCardBody>,
        res: Response
    ) => {
        const { "x-api-key": apiKey } = req.headers;
        const { id, type, password } = req.body;

        await CardService.createCard(apiKey, id, type, password);
        return res.status(201).send({ message: "cartão criado com sucesso!" });
    };
}

export default CardController;
