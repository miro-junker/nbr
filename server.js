import express from "express";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import createWsServer from "./server/server-ws.js";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to SSL certificate & key
const sslOptions = {
  key: fs.readFileSync("ssl/letsencrypt/privkey.pem"),
  cert: fs.readFileSync("ssl/letsencrypt/fullchain.pem"),
};

// Create Express app
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res) => res.status(404).send("404 Not Found"));

// Redirect HTTP → HTTPS
const redirectApp = express();
redirectApp.use((req, res) => {
  const host = req.headers.host.replace(/:\d+$/, ""); // remove port if present
  res.redirect(`https://${host}${req.url}`);
});

// Start HTTP server on port 80
const httpServer = http.createServer(redirectApp);
httpServer.listen(80, () => {
  console.log("HTTP server running on port 80 (redirects to HTTPS)");
});

// Start HTTPS server on port 443
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(443, () => {
  console.log("HTTPS server running on port 443");
});

// --- Integrate WebSocket server from server-ws.js ---
const wss = createWsServer({ server: httpsServer }); // pass the HTTPS server

export { httpsServer, wss };
