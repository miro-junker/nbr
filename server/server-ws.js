import { WebSocketServer, WebSocket } from "ws";

// Helper to log messages with a human-readable timestamp
function log(...args) {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const date = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    console.log(`[${date} ${time}]`, ...args);
}

function createWsServer({ port, server }) {
    const wss = server
        ? new WebSocketServer({ server })
        : new WebSocketServer({ port });

    let sensorSocket = null; // todo: unused?
    let displaySocket = null;

    wss.on("connection", (ws, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const role = url.searchParams.get("role");
        log("New websocket connection:", role);

        if (role === "sensor") {
            sensorSocket = ws;
            log("Sensor connected");

            ws.on("message", (msg) => {
                if (displaySocket && displaySocket.readyState === WebSocket.OPEN) {
                    displaySocket.send(msg);
                }
            });

            ws.on("close", () => {
                log("Sensor disconnected");
                sensorSocket = null;
            });
        }

        if (role === "display") {
            displaySocket = ws;
            log("Display connected");

            ws.on("close", () => {
                log("Display disconnected");
                displaySocket = null;
            });
        }
    });

    return wss;
}

export default createWsServer;
