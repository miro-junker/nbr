import express from 'express';
import cors from 'cors';
import db from '../db/db.js';


const HEADER_API_TOKEN = 'x-api-token';


export default function createApiRouter({
    tokenCheckEnabled = true,
    secret = '',
} = {}) {
    const router = express.Router();
    router.use(express.json());

    // --- Enable CORS for all origins ---
    router.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', HEADER_API_TOKEN]
    }));

    // --- POST /score ---
    router.post('/score', (req, res) => {
        const token = req.headers[HEADER_API_TOKEN];
        if (tokenCheckEnabled && token !== secret) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { username, score } = req.body;
        if (typeof username !== 'string' || !Number.isFinite(score)) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        db.prepare('INSERT INTO scores (user_name, score) VALUES (?, ?)').run(username, score);
        res.sendStatus(200);
    });

    // --- GET /scores ---
    router.get('/scores', (req, res) => {
        const scores = db.prepare('SELECT user_name, score FROM scores ORDER BY score DESC LIMIT 10').all();
        res.json(scores);
    });

    return router;
}
