"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOut = void 0;
const gameStatus_1 = require("../game/gameStatus");
const roomService_1 = require("../../services/roomService");
const serverResponses_1 = require("../responses/serverResponses");
const closeReasons_1 = require("./closeReasons");
exports.TimeOut = {
    set(room) {
        this.remove(room);
        room.timeout = setTimeout(() => {
            const existingRoom = roomService_1.RoomService.getRoom(room.room_id);
            if (existingRoom === serverResponses_1.ServerResponses.NotFound)
                return;
            if (existingRoom.status !== gameStatus_1.GameStatus.GameRunning)
                roomService_1.RoomService.closeRoom(existingRoom.room_id, closeReasons_1.CloseReasons.TIMEOUT);
        }, 5 * 60 * 1000);
    },
    remove(room) {
        if (room.timeout)
            clearTimeout(room.timeout);
    }
};
//# sourceMappingURL=timeOut.js.map