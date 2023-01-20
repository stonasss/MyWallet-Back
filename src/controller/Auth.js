import bcrypt from "bcrypt";
import joi from "joi";
import db from "../config/database.js"
import { v4 as uuidV4 } from "uuid";

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

export async function signUp(req, res) {
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
    const emailExists = await db
      .collection("users")
      .findOne({ email: email});
    if (emailExists) return res.status(400).send("E-mail já cadastrado");

    await db
      .collection("users")
      .insertOne({
        username,
        email,
        password: passwordHashed,
      });
    res.status(201).send("Usuário cadastrado");
  } catch (err) {
    res.status(500).send(err.message);
  };
}

export async function signIn(req, res) {
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
  };
}