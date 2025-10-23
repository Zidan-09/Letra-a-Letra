"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./socket");
const server_json_1 = __importDefault(require("./settings/server.json"));
const PORT = Number(process.env.PORT) || 3333;
const VERSION = server_json_1.default.version || "v1";
function startServer() {
    const httpServer = (0, http_1.createServer)(app_1.default);
    (0, socket_1.initSocket)(httpServer);
    httpServer.listen(PORT, () => {
        console.log(`Server Running, version: ${VERSION}, on port: ${PORT}`);
    });
}
startServer();
//# sourceMappingURL=server.js.map