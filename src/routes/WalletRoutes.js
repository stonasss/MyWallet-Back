import { wallets, deposit, users, sessions, withdraw } from "../controller/Wallets.js";
import { Router } from "express";
import { authValidation } from "../middleware/AuthMiddleware.js";
import { walletSchema } from "../model/WalletSchema.js";
import { validateSchema } from "../middleware/validateSchema.js";

const walletRouter = Router();

walletRouter.use(authValidation)
walletRouter.get("/wallets", wallets);
walletRouter.get("/users", users);
walletRouter.get("/sessions", sessions);
walletRouter.post("/nova-entrada", validateSchema(walletSchema), deposit);
walletRouter.post("/nova-saida", withdraw);

export default walletRouter;
