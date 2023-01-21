import { wallets, deposit, users, sessions } from "../controller/Wallets.js"
import { Router } from "express"

const walletRouter = Router()

walletRouter.get("/wallets", wallets)
walletRouter.get("/users", users)
walletRouter.get("/sessions", sessions)
walletRouter.post("/nova-entrada", deposit)

export default walletRouter