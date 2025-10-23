"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const roomService_1 = require("../services/roomService");
const gameStatus_1 = require("../utils/game/gameStatus");
const nullPlayer_1 = require("../utils/game/nullPlayer");
const logEnum_1 = require("../utils/server/logEnum");
const logger_1 = require("../utils/server/logger");
const board_1 = require("./board");
const closeReasons_1 = require("../utils/room/closeReasons");
class Game {
    constructor(room_id, room_name, status, player, timer, allowSpectators, privateRoom) {
        this.players = Array(2).fill(undefined);
        this.spectators = Array(5).fill(undefined);
        this.bannedPlayerIds = [];
        this.bannedPlayers = [];
        this.room_id = room_id;
        this.room_name = room_name;
        this.status = status;
        this.created_by = player.player_id;
        this.creator = player.nickname;
        this.timer = timer;
        this.turn = 0;
        this.board = null;
        this.allowSpectators = allowSpectators;
        this.privateRoom = privateRoom;
        this.players[0] = player;
        this.createdAt = Date.now();
    }
    ;
    toJSON() {
        return {
            room_id: this.room_id,
            room_name: this.room_name,
            status: this.status,
            createdAt: this.createdAt,
            players: this.players,
            spectators: this.spectators,
            bannedPlayerIds: this.bannedPlayerIds,
            bannedPlayers: this.bannedPlayers,
            created_by: this.created_by,
            creator: this.creator,
            timer: this.timer,
            turn: this.turn,
            board: this.board,
            allowSpectators: this.allowSpectators,
            privateRoom: this.privateRoom,
        };
    }
    ;
    startGame(theme, gamemode, allowedPowers) {
        this.board = new board_1.Board(theme, gamemode, allowedPowers);
        this.turn = 0;
        this.status = gameStatus_1.GameStatus.GameRunning;
    }
    setStatus(status) {
        this.status = status;
    }
    incrementTurn() {
        this.turn++;
    }
    gameOver() {
        const [p1, p2] = this.players;
        if (!this.board ||
            this.status === gameStatus_1.GameStatus.GameStarting ||
            this.status === gameStatus_1.GameStatus.GameOver)
            return false;
        if (!p1 && !p2) {
            const spectatorsExist = this.spectators.some(s => s);
            this.status = gameStatus_1.GameStatus.GameOver;
            (0, logger_1.createLog)(this.room_id, logEnum_1.LogEnum.GameOver);
            this.board = null;
            if (spectatorsExist) {
                return nullPlayer_1.nullPlayer;
            }
            roomService_1.RoomService.closeRoom(this.room_id, closeReasons_1.CloseReasons.ALL_LEFT);
            return false;
        }
        if ((p1 && !p2) || (!p1 && p2)) {
            const winner = p1 || p2;
            this.status = gameStatus_1.GameStatus.GameOver;
            (0, logger_1.createLog)(this.room_id, logEnum_1.LogEnum.GameOver);
            this.board = null;
            return winner;
        }
        if (p1 && p2) {
            if (p1.score < 3 && p2.score < 3)
                return false;
            this.status = gameStatus_1.GameStatus.GameOver;
            (0, logger_1.createLog)(this.room_id, logEnum_1.LogEnum.GameOver);
            this.board = null;
            return p1.score >= 3 ? p1 : p2;
        }
        return false;
    }
    ;
}
exports.Game = Game;
//# sourceMappingURL=game.js.map