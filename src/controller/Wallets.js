import db from "../config/database.js";
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

export async function transactions(req, res) {
    const userAccess = res.locals.session;

    const userWallet = await db
        .collection("wallets")
        .findOne({ _id: userAccess._id });
    const { username, wallet } = userWallet
    return res.status(202).send({ username, wallet })
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
    const { value, description } = req.body;
    const userAccess = res.locals.session;
    const time = dayjs().format("DD/MM");

    try {
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
        res.status(201).send("Depósito realizado");
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function withdraw(req, res) {
    const { value, description } = req.body;
    const userAccess = res.locals.session;
    const time = dayjs().format("DD/MM");

    try {
        const withdraw = {
            value,
            description,
            date: time,
            type: "withdraw",
        };
        await db
            .collection("wallets")
            .updateOne(
                { _id: userAccess._id },
                { $push: { wallet: { ...withdraw } } }
            );
        res.status(201).send("Saque registrado");
    } catch (err) {
        res.status(500).send(err);
    }
}
