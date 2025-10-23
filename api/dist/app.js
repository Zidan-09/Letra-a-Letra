"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const playerRoutes_1 = __importDefault(require("./routes/playerRoutes"));
const server_json_1 = __importDefault(require("./settings/server.json"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const VERSION = server_json_1.default.version || "v1";
app.use(`/api/${VERSION}/room`, roomRoutes_1.default);
app.use(`/api/${VERSION}/game`, gameRoutes_1.default);
app.use(`/api/${VERSION}/player`, playerRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map