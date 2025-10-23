"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLog = createLog;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createLog(room_id, message) {
    const dateNow = new Date();
    const logDir = path_1.default.join(__dirname, "..", "..", "logs");
    if (!fs_1.default.existsSync(logDir))
        fs_1.default.mkdirSync(logDir, { recursive: true });
    const file = path_1.default.join(logDir, `${dateNow.getUTCMonth() + 1}.${dateNow.getUTCDate()}.${dateNow.getUTCFullYear()}_${room_id}.log`);
    const log = `[${dateNow.toISOString()}] ${message}\n`;
    try {
        fs_1.default.appendFileSync(file, log, "utf-8");
    }
    catch (err) {
        console.error(`Failed to write log for room ${room_id}:`, err);
    }
}
//# sourceMappingURL=logger.js.map