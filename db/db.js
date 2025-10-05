import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";


// --- Resolve correct path in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Path to the database file ---
const dbPath = path.join(__dirname, "db", "scores.db");

// --- Initialize the database ---
const db = new Database(dbPath);

// --- Create table if not exists ---
db.prepare(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        user_name TEXT,
        score INTEGER
    )
`).run();

export default db;
