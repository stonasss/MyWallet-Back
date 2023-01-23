import {
    transactions,
    wallets,
    deposit,
    users,
    sessions,
    withdraw,
} from "../controller/Wallets.js";
import { Router } from "express";
import { walletSchema } from "../model/WalletSchema.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { authValidation } from "../middleware/AuthMiddleware.js";

const walletRouter = Router();

walletRouter.get("/wallets", wallets);
walletRouter.get("/transactions", authValidation, transactions)
walletRouter.get("/users", users);
walletRouter.get("/sessions", sessions);

walletRouter.use(authValidation, validateSchema(walletSchema));
walletRouter.post("/nova-entrada", deposit);
walletRouter.post("/nova-saida", withdraw);

export default walletRouter;
