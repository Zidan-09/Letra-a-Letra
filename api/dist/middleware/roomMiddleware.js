"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMiddleware = void 0;
const handleResponse_1 = require("../utils/server/handleResponse");
const roomResponses_1 = require("../utils/responses/roomResponses");
const roomService_1 = require("../services/roomService");
const serverResponses_1 = require("../utils/responses/serverResponses");
const playerResponses_1 = require("../utils/responses/playerResponses");
const playerService_1 = require("../services/playerService");
const banReasons_1 = require("../utils/player/banReasons");
exports.RoomMiddleware = {
    createRoom(req, res, next) {
        try {
            const { room_name, allowSpectators, privateRoom, player_id } = req.body;
            if (!room_name ||
                room_name.length > 10 ||
                allowSpectators === undefined ||
                privateRoom === undefined ||
                !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const player = playerService_1.PlayerService.getPlayer(player_id);
            if (player === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (player.ban && player.timeOut)
                return handleResponse_1.HandleResponse.serverResponse(res, 403, false, roomResponses_1.RoomResponses.BANNED_PLAYER, banReasons_1.BanReason.TIMEOUT);
            if (player.ban)
                return handleResponse_1.HandleResponse.serverResponse(res, 403, false, roomResponses_1.RoomResponses.BANNED_PLAYER, banReasons_1.BanReason.PERMANENT);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    joinRoom(req, res, next) {
        const { room_id } = req.params;
        const { spectator, player_id } = req.body;
        try {
            if (!room_id || spectator === undefined || !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if ((!spectator && game.players.every((p) => p)) ||
                (spectator && game.spectators.every((s) => s)))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.FULL_ROOM);
            if (!game.allowSpectators && spectator)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.SPECTATORS_OFF);
            if (game.bannedPlayerIds.includes(player_id))
                return handleResponse_1.HandleResponse.serverResponse(res, 403, false, roomResponses_1.RoomResponses.BANNED_PLAYER, banReasons_1.BanReason.ROOM_BAN);
            const player = playerService_1.PlayerService.getPlayer(player_id);
            if (player === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (player.ban && player.timeOut)
                return handleResponse_1.HandleResponse.serverResponse(res, 403, false, roomResponses_1.RoomResponses.BANNED_PLAYER, banReasons_1.BanReason.TIMEOUT);
            if (player.ban)
                return handleResponse_1.HandleResponse.serverResponse(res, 403, false, roomResponses_1.RoomResponses.BANNED_PLAYER, banReasons_1.BanReason.PERMANENT);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    changeRole(req, res, next) {
        const { room_id, player_id } = req.params;
        const { role, index } = req.body;
        try {
            if (!room_id || !player_id || !role || index === undefined)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (role === "spectator") {
                const target = game.players.filter(Boolean).find((p) => p.player_id === player_id) ||
                    game.spectators
                        .filter(Boolean)
                        .find((s) => s.player_id === player_id);
                if (!target)
                    return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
                if (index < 0 || index >= game.spectators.length)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.INVALID_SLOT);
                if (target.spectator && game.spectators[index]?.player_id === player_id)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, playerResponses_1.PlayerResponses.ALREADY_SPECTATOR);
            }
            if (role === "player") {
                const target = game.players.filter(Boolean).find((p) => p.player_id === player_id) ||
                    game.spectators
                        .filter(Boolean)
                        .find((s) => s.player_id === player_id);
                if (!target)
                    return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
                if (index < 0 || index >= game.players.length)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.INVALID_SLOT);
                if (!target.spectator && game.players[index]?.player_id === player_id)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, playerResponses_1.PlayerResponses.ALREADY_PLAYER);
                if (game.players[index] && game.players[index].player_id !== player_id)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.FULL_ROOM);
            }
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    getRoom(req, res, next) {
        const { room_id } = req.params;
        try {
            if (!room_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    leftRoom(req, res, next) {
        const { room_id, player_id } = req.params;
        try {
            if (!room_id || !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND ||
                ![...game.players, ...game.spectators]
                    .filter(Boolean)
                    .find((p) => p.player_id === player_id))
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    removePlayer(req, res, next) {
        const { room_id, player_id } = req.params;
        const { banned } = req.body;
        try {
            if (!room_id || !player_id || banned === undefined)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            const player = [...game.players, ...game.spectators]
                .filter(Boolean)
                .find((p) => p.player_id === player_id);
            if (!player)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (player.player_id === game.created_by)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.DATA_ERROR);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    unbanPlayer(req, res, next) {
        const { room_id, player_id } = req.params;
        try {
            if (!room_id || !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (!game.bannedPlayerIds.includes(player_id))
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, roomResponses_1.RoomResponses.BANNED_PLAYER_NOT_FOUND);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
};
//# sourceMappingURL=roomMiddleware.js.map