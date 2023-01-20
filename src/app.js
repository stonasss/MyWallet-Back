import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import joi from "joi";
import { v4 as uuidV4 } from "uuid";

dotenv.config();
const server = express();
server.use(express.json());
server.use(cors());
const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db();
} catch (err) {
  console.log(err);
}

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

server.post("/cadastro", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const { err } = userSchema.validate({
    username,
    email,
    password,
    confirmPassword,
  });

  if (err) {
    const errMsgs = err.details.map((err) => err.message);
    return res.status(422).send(errMsgs);
  }

  const passwordHashed = bcrypt.hashSync(password, 10);

  try {
    await db.collection("users").insertOne({
      username,
      email,
      password: passwordHashed,
    });
    res.status(201).send("Usuário cadastrado");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

server.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await db.collection("users").findOne({ email });
    if (!userExists) return res.status(422).send("Dados incorretos");

    const passwordCorrect = bcrypt.compareSync(password, userExists.password);
    if (!passwordCorrect) return res.status(422).send("Dados incorretos");

    const token = uuidV4();
    return res.status(200).send(token);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log("Servidor aberto");
});
