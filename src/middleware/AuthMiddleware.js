import db from "../config/database.js";

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    
    if (!token) return res.status(422).send("Informe o token")

    try {
        const userAccess = await db.collection("sessions").findOne({ token: token });
        if (!userAccess) return res.status(422).send("Acesso negado no Middleware");
        res.locals.session = userAccess;

        next()
    } catch (err) {
        return res.status(500).send(err)
    }
}