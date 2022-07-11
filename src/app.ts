import express from "express";
import "express-async-errors";
import cors from "cors";

import errorHandler from "./middlewares/errorHandler";
import cardRouter from "./routers/cardRouter";
import rechargeRouter from "./routers/rechargeRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/card", cardRouter);
app.use("/recharge", rechargeRouter);
app.use(errorHandler);

export default app;
