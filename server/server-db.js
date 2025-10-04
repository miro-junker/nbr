import express from "express";
import db from "../db/db.js";


const API_TOKEN_HEADER = "x-api-token"


export default function createDbRouter({
    tokenCheckEnabled = true,
    secret = "",
} = {}) {
    const router = express.Router();
    router.use(express.json());

    // --- POST /score (protected) ---
    router.post("/score", (req, res) => {
        const token = req.headers[API_TOKEN_HEADER];

        if (tokenCheckEnabled && token !== secret) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { player, score } = req.body;

        if (typeof player !== "string" || !Number.isFinite(score)) {
            return res.status(400).json({ error: "Invalid data" });
        }

        db.prepare("INSERT INTO scores (player, score) VALUES (?, ?)").run(player, score);
        res.sendStatus(200);
    });

    // --- GET /scores (public) ---
    router.get("/scores", (req, res) => {
        const scores = db
            .prepare("SELECT player, score FROM scores ORDER BY score DESC LIMIT 10")
            .all();
        res.json(scores);
    });

    return router;
}
