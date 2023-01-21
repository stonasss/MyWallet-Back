import db from "../config/database.js";

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.status(422).send("Token inválido");

    try {
        const userAccess = await db.collection("sessions").findOne({ token });
        if (!userAccess) return res.status(422).send("Acesso negado");
        
        res.locals.session = userAccess

        next()
    } catch (err) {
        res.status(500).send(err)
    }
}