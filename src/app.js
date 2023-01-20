import express from "express";
import cors from "cors";
import { signIn, signUp } from "./controller/Auth.js"

const server = express();
server.use(express.json());
server.use(cors());

server.post("/", signIn)
server.post("/cadastro", signUp)

const PORT = 5000;
server.listen(PORT, () => {
  console.log("Servidor aberto");
});
