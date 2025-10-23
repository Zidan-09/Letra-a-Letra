"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMiddleware = void 0;
const handleResponse_1 = require("../utils/server/handleResponse");
const roomResponses_1 = require("../utils/responses/roomResponses");
const roomService_1 = require("../services/roomService");
const serverResponses_1 = require("../utils/responses/serverResponses");
const playerResponses_1 = require("../utils/responses/playerResponses");
exports.RoomMiddleware = {
    createRoom(req, res, next) {
        try {
            const { room_name, timer, allowSpectators, privateRoom, player_id } = req.body;
            if (!room_name ||
                !timer ||
                room_name.length > 10 ||
                allowSpectators === undefined ||
                privateRoom === undefined ||
                !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
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
            if (!room_id ||
                spectator === undefined ||
                !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            if ((!spectator && game.players.every(p => p)) ||
                (spectator && game.spectators.every(s => s)))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.FullRoom);
            if (!game.allowSpectators && spectator)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.SpectatorsOff);
            if (game.bannedPlayerIds.includes(player_id))
                return handleResponse_1.HandleResponse.serverResponse(res, 403, false, roomResponses_1.RoomResponses.BannedPlayer);
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
            if (!room_id ||
                !player_id ||
                !role ||
                index === undefined)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            if (role === "spectator") {
                const target = game.players.filter(Boolean).find(p => p.player_id === player_id)
                    || game.spectators.filter(Boolean).find(s => s.player_id === player_id);
                if (!target)
                    return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
                if (index < 0 || index >= game.spectators.length)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.InvalidSlot);
                if (target.spectator && game.spectators[index]?.player_id === player_id)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, playerResponses_1.PlayerResponses.AlreadySpectator);
            }
            if (role === "player") {
                const target = game.players.filter(Boolean).find(p => p.player_id === player_id)
                    || game.spectators.filter(Boolean).find(s => s.player_id === player_id);
                if (!target)
                    return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
                if (index < 0 || index >= game.players.length)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.InvalidSlot);
                if (!target.spectator && game.players[index]?.player_id === player_id)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, playerResponses_1.PlayerResponses.AlreadyPlayer);
                if (game.players[index] && game.players[index].player_id !== player_id)
                    return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.FullRoom);
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
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
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
            if (!room_id ||
                !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NotFound ||
                ![...game.players, ...game.spectators].filter(Boolean).find(p => p.player_id === player_id))
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
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
            if (!room_id ||
                !player_id ||
                banned === undefined)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            const player = [...game.players, ...game.spectators].filter(Boolean).find(p => p.player_id === player_id);
            if (!player)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            if (player.player_id === game.created_by)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.DataError);
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
            if (!room_id ||
                !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MissingData);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            if (!game.bannedPlayerIds.includes(player_id))
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, roomResponses_1.RoomResponses.BannedPlayerNotFound);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    }
};
//# sourceMappingURL=roomMiddleware.js.map