"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const roomService_1 = require("../../services/roomService");
const serverResponses_1 = require("../responses/serverResponses");
const socket_1 = require("../../socket");
function sendMessage(room_id, from, message) {
    const io = (0, socket_1.getSocketInstance)();
    const room = roomService_1.RoomService.getRoom(room_id);
    if (room === serverResponses_1.ServerResponses.NotFound)
        return;
    const all = [...room.players, ...room.spectators];
    if (!all)
        return;
    all.filter(Boolean).forEach(p => io.to(p.player_id).emit("message", { from: from, message: message }));
}
//# sourceMappingURL=message.js.map