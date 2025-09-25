import { WebSocketServer, WebSocket } from "ws";

function createWsServer({ port, server }) {
  // If `server` is provided, attach to it; otherwise use standalone port
  const wss = server
    ? new WebSocketServer({ server })
    : new WebSocketServer({ port });

  let controllerSocket = null;
  let displaySocket = null;

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.searchParams.get("role");
    console.log("New websocket connection", role);

    if (role === "sensor") {
      controllerSocket = ws;
      console.log("Sensor connected");

      // Forward sensor messages to display (if connected)
      ws.on("message", (msg) => {
        console.log(`    Sensor message: ${msg}`);
        if (displaySocket && displaySocket.readyState === WebSocket.OPEN) {
          displaySocket.send(msg);
        }
      });

      ws.on("close", () => {
        console.log("Sensor disconnected");
        controllerSocket = null;
      });
    }

    if (role === "display") {
      displaySocket = ws;
      console.log("Display connected");

      ws.on("close", () => {
        console.log("Display disconnected");
        displaySocket = null;
      });
    }
  });

  return wss;
}

export default createWsServer;
