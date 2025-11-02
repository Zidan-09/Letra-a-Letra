"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketInstance = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const roomService_1 = require("./services/roomService");
const message_1 = require("./utils/socket/message");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        socket.on("reconnect_player", ({ room_id, nickname }) => {
            roomService_1.RoomService.reconnectRoom(room_id, nickname, socket.id);
        });
        socket.on("message", ({ room_id, from, message }) => {
            (0, message_1.sendMessage)(room_id, from, message);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getSocketInstance = () => io;
exports.getSocketInstance = getSocketInstance;
//# sourceMappingURL=socket.js.map