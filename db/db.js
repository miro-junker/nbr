import Database from "better-sqlite3";

const db = new Database("scores.db");


// Create table if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        user_name TEXT,
        score INTEGER
    )
`).run();


export default db;
