import bcrypt from "bcrypt";
import db from "../config/database.js";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    const passwordHashed = bcrypt.hashSync(password, 10);

    try {
        const emailExists = await db
            .collection("users")
            .findOne({ email: email });
        if (emailExists) return res.status(400).send("E-mail já cadastrado");

        await db.collection("users").insertOne({
            username,
            email,
            password: passwordHashed,
        });
        res.status(201).send("Usuário cadastrado");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const userExists = await db.collection("users").findOne({ email });
        if (!userExists) return res.status(422).send("Usuário inexistente");

        const passwordCorrect = bcrypt.compareSync(
            password,
            userExists.password
        );
        if (!passwordCorrect) return res.status(422).send("Dados incorretos");

        // verifica se o usuário está em sessão
        const token = uuidV4();

        const userSession = await db
            .collection("sessions")
            .findOne({ _id: userExists._id });

        if (userSession) {
            await db
                .collection("sessions")
                .updateOne({ _id: userExists._id }, { $set: { token: token } });
        } else {
            await db
                .collection("sessions")
                .insertOne({ _id: userExists._id, token: token });
        }

        const walletExists = await db
            .collection("wallets")
            .findOne({ _id: userExists._id });

        if (!walletExists) {
            await db.collection("wallets").insertOne({
                _id: userExists._id,
                username: userExists.username,
                wallet: [],
            });
        }

        return res.status(200).send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
