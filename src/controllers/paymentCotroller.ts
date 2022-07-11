import { Response } from "express";
import { CustomRequest } from "../utils/interfaces";
import { StatusCode } from "../utils/statusCode";

class PaymentController {
    static purchase = (req: CustomRequest<any>, res: Response) => {
        console.log(req);
        // const validation = cardIdParamSchema.validate(cardId);
        // if (validation.error) {
        //     throw new HttpError(
        //         StatusCode.BadRequest_400,
        //         "id de cartão inválido"
        //     );
        // }
        res.status(StatusCode.Created_201).send({ msg: "" });
    };
}
