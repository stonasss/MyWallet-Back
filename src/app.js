import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const server = express();
server.use(express.json());
server.use(cors());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
await mongoClient.connect();
let db = mongoClient.db();

const PORT = 5000;
server.listen(PORT, () => {
    console.log("Servidor aberto");
});