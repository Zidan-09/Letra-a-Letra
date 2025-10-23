"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const game_1 = require("../entities/game");
const serverResponses_1 = require("../utils/responses/serverResponses");
const roomResponses_1 = require("../utils/responses/roomResponses");
const nanoid_1 = require("nanoid");
const gameStatus_1 = require("../utils/game/gameStatus");
const logger_1 = require("../utils/server/logger");
const logEnum_1 = require("../utils/server/logEnum");
const gameSocket_1 = require("../utils/socket/gameSocket");
const roomSocket_1 = require("../utils/socket/roomSocket");
const playerService_1 = require("./playerService");
const enumNicknames_1 = require("../utils/room/enumNicknames");
const roomTImeOut_1 = require("../utils/room/roomTImeOut");
class RoomServices {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(room_name, timer, allowSpectators, privateRoom, player_id) {
        const player = playerService_1.PlayerService.getPlayer(player_id);
        if (player === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        const room = new game_1.Game((0, nanoid_1.nanoid)(6), room_name, gameStatus_1.GameStatus.GameStarting, player, timer, allowSpectators, privateRoom);
        (0, logger_1.createLog)(room.room_id, logEnum_1.LogEnum.RoomCreated);
        (0, logger_1.createLog)(room.room_id, `${player.nickname} ${logEnum_1.LogEnum.PlayerJoined}`);
        (0, roomTImeOut_1.roomTimeOut)(room);
        this.rooms.set(room.room_id, room);
        playerService_1.PlayerService.removePlayer(player_id);
        return room;
    }
    ;
    joinRoom(room_id, player_id, spectator) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        const player = playerService_1.PlayerService.getPlayer(player_id);
        if (player === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        if (spectator) {
            const index = room.spectators.findIndex(s => !s);
            room.spectators[index] = player;
            player.spectator = true;
            (0, logger_1.createLog)(room.room_id, `${player.nickname} ${logEnum_1.LogEnum.PlayerJoinedAsSpectator}`);
        }
        else {
            const index = room.players.findIndex(p => !p);
            room.players[index] = player;
            (0, logger_1.createLog)(room.room_id, `${player.nickname} ${logEnum_1.LogEnum.PlayerJoined}`);
        }
        const sameNickname = [...room.players, ...room.spectators].filter(Boolean).find(p => p.nickname === player.nickname);
        if (sameNickname)
            (0, enumNicknames_1.enumNicknames)([...room.players, ...room.spectators]);
        roomSocket_1.RoomSocket.joinRoom([...room.players, ...room.spectators], room);
        return room;
    }
    ;
    reconnectRoom(room_id, nickname, new_id) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        const disconnectedPlayer = room.players.filter(Boolean).find(p => p?.nickname === nickname);
        if (!disconnectedPlayer)
            return serverResponses_1.ServerResponses.NotFound;
        disconnectedPlayer.player_id = new_id;
        (0, logger_1.createLog)(room_id, `${nickname} ${logEnum_1.LogEnum.PlayerReconnected}`);
        return serverResponses_1.ServerResponses.Reconnected;
    }
    ;
    leaveRoom(room_id, player_id) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        const player = room.players.filter(Boolean).find(p => p.player_id === player_id) ||
            room.spectators.filter(Boolean).find(s => s.player_id === player_id);
        if (!player)
            return serverResponses_1.ServerResponses.NotFound;
        if (player.spectator) {
            const index = room.spectators.findIndex(p => p?.player_id === player_id);
            if (index !== -1)
                room.spectators[index] = undefined;
        }
        else {
            const index = room.players.findIndex(p => p?.player_id === player_id);
            if (index !== -1)
                room.players[index] = undefined;
        }
        ;
        (0, enumNicknames_1.enumNicknames)([...room.players, ...room.spectators]);
        if (room.created_by === player.player_id) {
            const allRemaining = [...room.players, ...room.spectators].filter(Boolean);
            const newLeader = allRemaining[0];
            if (newLeader) {
                room.created_by = newLeader.player_id;
                room.creator = newLeader.nickname;
            }
            ;
        }
        ;
        (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.PlayerLeft}`);
        playerService_1.PlayerService.savePlayer(player);
        const all = [...room.players, ...room.spectators];
        if (!all.some(Boolean)) {
            this.rooms.delete(room_id);
            return roomResponses_1.RoomResponses.RoomClosed;
        }
        roomSocket_1.RoomSocket.leftRoom(all, room);
        try {
            gameSocket_1.GameSocket.gameOver(room_id);
        }
        catch (err) {
            console.warn(`gameOver failed for room ${room_id}:`, err);
        }
        return roomResponses_1.RoomResponses.LeftRoom;
    }
    ;
    afkPlayer(room_id, player_id) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        const playerIndex = room.players.findIndex(p => p?.player_id === player_id);
        if (playerIndex === -1)
            return serverResponses_1.ServerResponses.NotFound;
        const player = room.players[playerIndex];
        if (player) {
            player.passed = 0;
            playerService_1.PlayerService.savePlayer(player);
        }
        ;
        room.players[playerIndex] = undefined;
        gameSocket_1.GameSocket.gameOver(room_id);
        gameSocket_1.GameSocket.afkPlayer(player_id);
        return serverResponses_1.ServerResponses.Ended;
    }
    ;
    changeRole(room_id, player_id, role, index) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        const spectator = role === "spectator";
        const player = room.players.filter(Boolean).find(p => p.player_id === player_id) ||
            room.spectators.filter(Boolean).find(s => s.player_id === player_id);
        if (!player)
            return serverResponses_1.ServerResponses.NotFound;
        const currentArray = player.spectator ? room.spectators : room.players;
        const otherArray = player.spectator ? room.players : room.spectators;
        const playerIndex = currentArray.findIndex(p => p?.player_id === player_id);
        if (player.spectator === spectator) {
            if (currentArray[index])
                return roomResponses_1.RoomResponses.FullRoom;
            currentArray[playerIndex] = undefined;
            currentArray[index] = player;
            (0, logger_1.createLog)(room.room_id, `${player.nickname} ${logEnum_1.LogEnum.SwapSlot}`);
        }
        else {
            if (otherArray[index])
                return roomResponses_1.RoomResponses.FullRoom;
            currentArray[playerIndex] = undefined;
            player.spectator = spectator;
            otherArray[index] = player;
            (0, logger_1.createLog)(room.room_id, `${player.nickname} ${spectator ? logEnum_1.LogEnum.PlayerTurnedToSpectator : logEnum_1.LogEnum.SpectatorTurnedToPlayer}`);
        }
        roomSocket_1.RoomSocket.changeRole([...room.players, ...room.spectators], room);
        return room;
    }
    ;
    getRoom(id) {
        return this.rooms.get(id) ?? serverResponses_1.ServerResponses.NotFound;
    }
    ;
    getPublicRooms() {
        return Array.from(this.rooms.values()).filter(room => !room.privateRoom);
    }
    ;
    closeRoom(room_id, reason) {
        const room = this.rooms.get(room_id);
        if (!room)
            return false;
        clearTimeout(room.timeout);
        roomSocket_1.RoomSocket.roomClosed([...room.players, ...room.spectators], reason);
        (0, logger_1.createLog)(room_id, `${logEnum_1.LogEnum.RoomClosed} because ${reason}`);
        return this.rooms.delete(room_id);
    }
    ;
    removePlayer(room_id, player_id, banned) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        const all = [...room.players, ...room.spectators];
        const player = all.filter(Boolean).find(p => p.player_id === player_id);
        if (!player)
            return serverResponses_1.ServerResponses.NotFound;
        const idx = all.filter(Boolean).findIndex(p => p === player);
        room.players[idx] = undefined;
        if (banned) {
            room.bannedPlayerIds.push(player_id);
            room.bannedPlayers.push(player);
        }
        ;
        playerService_1.PlayerService.savePlayer(player);
        (0, logger_1.createLog)(room_id, `${player.nickname} ${banned ? logEnum_1.LogEnum.PlayerBanned : logEnum_1.LogEnum.PlayerKicked}`);
        roomSocket_1.RoomSocket.removePlayer(all, room, banned, player_id);
        return room;
    }
    ;
    unbanPlayer(room_id, player_id) {
        const room = this.rooms.get(room_id);
        if (!room)
            return serverResponses_1.ServerResponses.NotFound;
        if (!room.bannedPlayerIds.includes(player_id))
            return roomResponses_1.RoomResponses.BannedPlayerNotFound;
        const idx = room.bannedPlayerIds.findIndex(id => id === player_id);
        const pid = room.bannedPlayers.findIndex(p => p.player_id === player_id);
        if (idx === undefined || pid === undefined)
            return roomResponses_1.RoomResponses.BannedPlayerNotFound;
        room.bannedPlayerIds.splice(idx, 1);
        room.bannedPlayers.splice(pid, 1);
        (0, logger_1.createLog)(room_id, `player with id: ${player_id} ${logEnum_1.LogEnum.PlayerUnbanned}`);
        return room;
    }
    ;
}
;
exports.RoomService = new RoomServices();
//# sourceMappingURL=roomService.js.map