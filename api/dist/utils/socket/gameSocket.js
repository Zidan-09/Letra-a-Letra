"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSocket = void 0;
const roomService_1 = require("../../services/roomService");
const socket_1 = require("../../socket");
const serverResponses_1 = require("../responses/serverResponses");
const gameResponses_1 = require("../responses/gameResponses");
exports.GameSocket = {
    gameStarted(room_id) {
        const io = (0, socket_1.getSocketInstance)();
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND ||
            !room.players ||
            !room.board ||
            !room.board.words)
            return;
        const players = room.players;
        const spectators = room.spectators;
        const data = {
            words: room.board.words,
            room: {
                room_id: room.room_id,
                room_name: room.room_name,
                status: room.status,
                players: room.players,
                spectators: room.spectators,
                created_by: room.created_by,
                creator: room.creator,
                timer: room.timer,
                turn: room.turn,
                allowSpectators: room.allowSpectators,
                privateRoom: room.privateRoom,
            },
        };
        const all = [...players, ...spectators];
        all
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("game_started", data));
    },
    movementOne(room_id, player_id, movement, data) {
        const io = (0, socket_1.getSocketInstance)();
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND)
            return;
        const all = [...room.players, ...room.spectators];
        all.filter(Boolean).forEach((p) => {
            if (p.player_id !== player_id)
                io.to(p.player_id).emit("movement", {
                    movement: movement,
                    player_id: player_id,
                    data: data.status === gameResponses_1.GameResponses.TRAP_TRIGGED ? data : data.status,
                    players: room.players,
                    turn: room.turn,
                });
        });
        io.to(player_id).emit("movement", {
            movement: movement,
            player_id: player_id,
            data: data,
            players: room.players,
            turn: room.turn,
        });
    },
    movementAll(room_id, player_id, movement, data) {
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND || !room.players || !room.spectators)
            return;
        const players = room.players;
        const spectators = room.spectators;
        const all = [...players, ...spectators];
        const io = (0, socket_1.getSocketInstance)();
        all.filter(Boolean).forEach((p) => io.to(p.player_id).emit("movement", {
            movement: movement,
            player_id: player_id,
            data: data,
            players: players,
            turn: room.turn,
        }));
    },
    passTurn(room_id) {
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND || !room.players || !room.spectators)
            return;
        const players = room.players;
        const spectators = room.spectators;
        const all = [...players, ...spectators];
        const io = (0, socket_1.getSocketInstance)();
        all
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("pass_turn", { turn: room.turn }));
    },
    afkPlayer(player_id) {
        const io = (0, socket_1.getSocketInstance)();
        io.to(player_id).emit("afk", player_id);
    },
    gameOver(room_id) {
        const io = (0, socket_1.getSocketInstance)();
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND)
            return;
        const players = room.players;
        const spectators = room.spectators;
        const winner = room.gameOver();
        if (!winner)
            return;
        const all = [...players, ...spectators];
        all.filter(Boolean).forEach((p) => io.to(p.player_id).emit("game_over", {
            winner: winner,
            room: room,
        }));
        players.filter(Boolean).forEach((p) => {
            p.reset();
        });
    },
    discardPower(room_id) {
        const io = (0, socket_1.getSocketInstance)();
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND)
            return;
        const all = [...room.players, ...room.spectators];
        all
            .filter(Boolean)
            .forEach((p) => io.to(p.player_id).emit("discard_power", room));
    },
};
//# sourceMappingURL=gameSocket.js.map