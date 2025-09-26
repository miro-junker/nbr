import express from "express";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import createWsServer from "./server/server-ws.js";
import "dotenv/config"; // Load .env automatically

// Read configuration from environment variables
const DEPLOY_TOKEN_ENABLED = process.env.DEPLOY_TOKEN_ENABLED === "true";
const DEPLOY_TOKEN_SECRET = process.env.DEPLOY_TOKEN_SECRET;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "ssl/letsencrypt/privkey.pem";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "ssl/letsencrypt/fullchain.pem";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to SSL certificate & key
const sslOptions = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
};

// Create Express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// --- /deploy endpoint ---
app.all("/deploy", (req, res) => {
  console.log(`Deploy attempt at ${new Date()}`);

  // Token check
  if (DEPLOY_TOKEN_ENABLED) {
    const token = req.headers["x-deploy-token"];
    if (token !== DEPLOY_TOKEN_SECRET) {
      return res.status(403).send("Forbidden");
    }
  }

  // Send HTTP response immediately
  res.send("Deploy started");

  // Run deploy.sh asynchronously in background
  const child = exec("./scripts/deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`Deploy failed: ${error}`);
    }
    console.log("Deploy stdout:", stdout);
    console.error("Deploy stderr:", stderr);
  });

  child.unref(); // detach child so server doesn't wait
});

// Catch-all 404 handler
app.use((req, res) => res.status(404).send("404 Not Found"));

// Redirect HTTP → HTTPS
const redirectApp = express();
redirectApp.use((req, res) => {
  const hostHeader = req.headers.host;
  if (!hostHeader) {
    return res.status(400).send("Bad Request: missing Host header");
  }
  const host = hostHeader.replace(/:\d+$/, "");
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

// --- Integrate WebSocket server ---
const wss = createWsServer({ server: httpsServer });

export { httpsServer, wss };
