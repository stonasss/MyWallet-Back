import { signIn, signUp } from "../controller/Auth.js"
import { Router } from "express"

const authRouter = Router()

authRouter.post("/", signIn)
authRouter.post("/cadastro", signUp)

export default authRouter