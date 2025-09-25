import { WebSocketServer, WebSocket } from "ws";


function createWsServer(port) {
  console.log("Creating websocket server")
  const wss = new WebSocketServer({ port });

  let controllerSocket = null;
  let displaySocket = null;

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.searchParams.get("role");
    console.log("New websocket connection", role)

    if (role === "sensor") {
      controllerSocket = ws;
      console.log("Sensor connected");

      // Forward controller messages to display (if connected)
      ws.on("message", (msg) => {
        console.log(`    Sensor message: ${msg}`);
        if (displaySocket && displaySocket.readyState === WebSocket.OPEN) {
          displaySocket.send(msg);
        }
      });

      ws.on("close", () => {
        console.log("sensor disconnected");
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
