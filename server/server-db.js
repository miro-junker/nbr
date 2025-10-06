import express from "express";
import db from "../db/db.js";

const API_TOKEN_HEADER = "x-api-token";

export default function createDbRouter({
    tokenCheckEnabled = true,
    secret = "",
} = {}) {
    const router = express.Router()
    router.use(express.json())

    // --- Disable CORS ---
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, " + API_TOKEN_HEADER)
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next()
    });

    // --- POST /score (protected) ---
    router.post("/score", (req, res) => {
        const token = req.headers[API_TOKEN_HEADER]

        if (tokenCheckEnabled && token !== secret) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { username, score } = req.body;

        if (typeof username !== "string" || !Number.isFinite(score)) {
            return res.status(400).json({ error: "Invalid data" });
        }

        db.prepare("INSERT INTO scores (user_name, score) VALUES (?, ?)").run(username, score)
        res.sendStatus(200)
    })

    // --- GET /scores (public) ---
    router.get("/scores", (req, res) => {
        const scores = db
            .prepare("SELECT user_name, score FROM scores ORDER BY score DESC LIMIT 10")
            .all();
        res.json(scores)
    })

    return router;
}
