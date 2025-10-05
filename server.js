import express from "express";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import createWsServer from "./server/server-ws.js";
import createDeployRouter from "./server/server-deploy.js";
import createDbRouter from "./server/server-db.js";
import "dotenv/config";


// --- Environment ---
const DEPLOY_TOKEN_ENABLED = process.env.DEPLOY_TOKEN_ENABLED === "true";
const DEPLOY_TOKEN_SECRET = process.env.DEPLOY_TOKEN_SECRET;

const DB_TOKEN_ENABLED = process.env.DB_TOKEN_ENABLED !== "false"; // default true
const DB_TOKEN_SECRET = process.env.DB_TOKEN_SECRET;

const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "ssl/letsencrypt/privkey.pem";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "ssl/letsencrypt/fullchain.pem";
const PORT_HTTP = parseInt(process.env.PORT_HTTP, 10) || 80;
const PORT_HTTPS = parseInt(process.env.PORT_HTTPS, 10) || 443;


// --- Resolve __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- SSL certs ---
const sslOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH),
};


// --- Create main app ---
const app = express();
app.use(express.static(path.join(__dirname, "public")));


// --- Routers ---
app.use(
    "/deploy",
    createDeployRouter({
        tokenCheckEnabled: DEPLOY_TOKEN_ENABLED,
        secret: DEPLOY_TOKEN_SECRET,
    })
);

app.use(
    "/db",
    createDbRouter({
        tokenCheckEnabled: DB_TOKEN_ENABLED,
        secret: DB_TOKEN_SECRET,
    })
);


// --- 404 handler ---
app.use((req, res) => res.status(404).send("404 Not Found"));


// --- HTTP → HTTPS redirect ---
const redirectApp = express();
redirectApp.use((req, res) => {
    const hostHeader = req.headers.host;
    if (!hostHeader) {
        return res.status(400).send("Bad Request: missing Host header");
    }
    const host = hostHeader.replace(/:\d+$/, "");
    res.redirect(`https://${host}${req.url}`);
});


// --- Start servers ---
const httpServer = http.createServer(redirectApp);
httpServer.listen(PORT_HTTP, () => {
    console.log(`HTTP server running on port ${PORT_HTTP} (redirects to HTTPS)`);
});

const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(PORT_HTTPS, () => {
    console.log(`HTTPS server running on port ${PORT_HTTPS}`);
});


// --- WebSocket server ---
const wss = createWsServer({ server: httpsServer });
