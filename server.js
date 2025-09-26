import express from "express";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import createWsServer from "./server/server-ws.js";

const DEPLOY_TOKEN_ENABLED = false
const DEPLOY_TOKEN_SECRET = 'hardcoded-supersecret-nbrtoken'

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

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// --- /deploy endpoint ---
app.all("/deploy", (req, res) => {
  const token = req.headers["x-deploy-token"];
  console.log(`Deploy attempt at ${new Date()}`);
  if (DEPLOY_TOKEN_ENABLED && token !== DEPLOY_TOKEN_SECRET) {
    return res.status(403).send("Forbidden");
  }

  exec("./scripts/deploy.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`Deploy error: ${error}`);
      return res.status(500).send("Deploy failed");
    }
    console.log(`Deploy stdout: ${stdout}`);
    console.error(`Deploy stderr: ${stderr}`);
    res.send("Deploy started");
  });
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
