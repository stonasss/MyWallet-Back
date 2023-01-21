import db from "../config/database.js";
import { walletSchema } from "../model/WalletSchema.js";
import dayjs from "dayjs";

export async function wallets(req, res) {
    await db
        .collection("wallets")
        .find()
        .toArray()
        .then((data) => {
            return res.send(data);
        })
        .catch(() => {
            res.status(500).send("Problema no servidor de banco de dados");
        });
}

export async function users(req, res) {
    await db
        .collection("users")
        .find()
        .toArray()
        .then((data) => {
            return res.send(data);
        })
        .catch(() => {
            res.status(500).send("Problema no servidor de banco de dados");
        });
}

export async function sessions(req, res) {
    await db
        .collection("sessions")
        .find()
        .toArray()
        .then((data) => {
            return res.send(data);
        })
        .catch(() => {
            res.status(500).send("Problema no servidor de banco de dados");
        });
}

export async function deposit(req, res) {
    const { authorization } = req.headers;
    const { value, description } = req.body;
    const token = authorization?.replace("Bearer ", "");
    const time = dayjs().format("DD/MM");

    const invalid = walletSchema.validate({ value, description });
    if (invalid.error) {
        res.status(422).send(invalid.error.details);
        return;
    }

    const userAccess = await db.collection("sessions").findOne({ token });
    if (!userAccess) {
        return res.status(422).send("Acesso negado");
    }

    try {
        const userWallet = await db
            .collection("wallets")
            .findOne({ _id: userAccess._id });
        const { wallet } = userWallet;

        const deposit = {
            value,
            description,
            date: time,
            type: "deposit",
        };
        await db
            .collection("wallets")
            .updateOne(
                { _id: userAccess._id },
                { $push: { wallet: { ...deposit } } }
            );
        res.status(201).send("Depósito registrado");
    } catch (err) {
        res.status(500).send(err);
    }
}
