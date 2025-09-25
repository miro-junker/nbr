import express from "express";
import path from "path";
import { fileURLToPath } from "url";

function createHttpServer(port) {
  const app = express();

  // Resolve __dirname for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Serve everything inside /public
  app.use(express.static(path.join(__dirname, "../public")));

  // Fallback route (optional, e.g. SPA routing)
  app.use((req, res) => {
    res.status(404).send("404 Not Found");
  });

  const server = app.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
  });

  return server;
}

export default createHttpServer;
