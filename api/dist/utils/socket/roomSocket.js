"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSocket = void 0;
const socket_1 = require("../../socket");
exports.RoomSocket = {
    joinRoom(players, room) {
        const io = (0, socket_1.getSocketInstance)();
        players
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("player_joined", room));
    },
    leftRoom(players, room) {
        const io = (0, socket_1.getSocketInstance)();
        players
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("player_left", room));
    },
    changeRole(players, room) {
        const io = (0, socket_1.getSocketInstance)();
        players
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("role_changed", room));
    },
    roomClosed(players, reason) {
        const io = (0, socket_1.getSocketInstance)();
        players
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("room_closed", reason));
    },
    removePlayer(players, room, banned, player_id) {
        const io = (0, socket_1.getSocketInstance)();
        const event = banned ? "banned" : "kicked";
        players
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit(event, { room: room, player: player_id }));
    },
};
//# sourceMappingURL=roomSocket.js.map