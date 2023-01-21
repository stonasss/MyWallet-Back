import { wallets, deposit, users, sessions, withdraw } from "../controller/Wallets.js";
import { Router } from "express";

const walletRouter = Router();

walletRouter.get("/wallets", wallets);
walletRouter.get("/users", users);
walletRouter.get("/sessions", sessions);
walletRouter.post("/nova-entrada", deposit);
walletRouter.post("/nova-saida", withdraw);

export default walletRouter;
