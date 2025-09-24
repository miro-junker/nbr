// server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 82 });

let controllerSocket = null;
let displaySocket = null;

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const role = url.searchParams.get("role");

  if (role === "controller") {
    controllerSocket = ws;
    console.log("controller connected");

    // Forward controller messages to display (if connected)
    ws.on("message", (msg) => {
      if (displaySocket && displaySocket.readyState === ws.OPEN) {
        displaySocket.send(msg);
      }
    });

    ws.on("close", () => {
      console.log("controller disconnected");
      controllerSocket = null;
    });
  }

  if (role === "display") {
    displaySocket = ws;
    console.log("display connected");

    ws.on("close", () => {
      console.log("display disconnected");
      displaySocket = null;
    });
  }
});
