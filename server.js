import config from './config.js'

import createHttpServer from "./server/server-http.js";
import createWsServer from "./server/server-ws.js";

console.log("NBR server starting")

createHttpServer(config.port_http);
createWsServer(config.port_ws);
