"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roomService_1 = require("../services/roomService");
const playerService_1 = require("../services/playerService");
playerService_1.PlayerService.createPlayer("player1", "Alex", false, 1);
playerService_1.PlayerService.createPlayer("player2", "Alex", false, 2);
playerService_1.PlayerService.createPlayer("player3", "Alex", false, 2);
playerService_1.PlayerService.createPlayer("player4", "Alex", false, 2);
playerService_1.PlayerService.createPlayer("player5", "Alex", false, 2);
playerService_1.PlayerService.createPlayer("player6", "Alex", false, 2);
const room = roomService_1.RoomService.createRoom("2", 15, true, false, "player1");
if (room !== "not_found") {
    roomService_1.RoomService.joinRoom(room.room_id, "player2", false);
    console.log(room.players[0]?.nickname, room.players[1]?.nickname);
    roomService_1.RoomService.leaveRoom(room.room_id, "player1");
    console.log(room.players[0]?.nickname, room.players[1]?.nickname);
    roomService_1.RoomService.joinRoom(room.room_id, "player3", false);
    roomService_1.RoomService.joinRoom(room.room_id, "player4", true);
    roomService_1.RoomService.joinRoom(room.room_id, "player5", true);
    roomService_1.RoomService.joinRoom(room.room_id, "player6", true);
    console.log(room.players[0]?.nickname, room.players[1]?.nickname);
    room.spectators.filter(Boolean).forEach(s => {
        console.log(s.nickname);
    });
}
//# sourceMappingURL=tests.js.map