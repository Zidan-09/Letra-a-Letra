"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const handleResponse_1 = require("../utils/server/handleResponse");
const roomService_1 = require("../services/roomService");
const roomResponses_1 = require("../utils/responses/roomResponses");
const serverResponses_1 = require("../utils/responses/serverResponses");
exports.RoomController = {
    createRoom(req, res) {
        const { room_name, timer, allowSpectators, privateRoom, player_id } = req.body;
        try {
            const room = roomService_1.RoomService.createRoom(room_name, timer, allowSpectators, privateRoom, player_id);
            if (room)
                return handleResponse_1.HandleResponse.serverResponse(res, 201, true, roomResponses_1.RoomResponses.RoomCreated, room);
            return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.RoomCreationFailed);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    joinRoom(req, res) {
        const { room_id } = req.params;
        const { spectator, player_id } = req.body;
        try {
            const result = roomService_1.RoomService.joinRoom(room_id, player_id, spectator);
            if (result === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, roomResponses_1.RoomResponses.RoomJoined, result);
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
            const result = roomService_1.RoomService.changeRole(room_id, player_id, role, index);
            if (result === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            if (result === roomResponses_1.RoomResponses.FullRoom)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, roomResponses_1.RoomResponses.FullRoom);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, roomResponses_1.RoomResponses.RoleChanged);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    getRooms(req, res) {
        try {
            const rooms = roomService_1.RoomService.getPublicRooms();
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, roomResponses_1.RoomResponses.PublicRooms, rooms);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    getRoom(req, res) {
        const { room_id } = req.params;
        try {
            const room = roomService_1.RoomService.getRoom(room_id);
            if (room === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, roomResponses_1.RoomResponses.RoomFound, room);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    leaveRoom(req, res) {
        const { room_id, player_id } = req.params;
        try {
            const result = roomService_1.RoomService.leaveRoom(room_id, player_id);
            if (result === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, result);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, result);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    removePlayer(req, res) {
        const { room_id, player_id } = req.params;
        const { banned } = req.body;
        try {
            const result = roomService_1.RoomService.removePlayer(room_id, player_id, banned);
            if (result === serverResponses_1.ServerResponses.NotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NotFound);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, roomResponses_1.RoomResponses.RemovedPlayer, result);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    unbanPlayer(req, res) {
        const { room_id, player_id } = req.params;
        try {
            const result = roomService_1.RoomService.unbanPlayer(room_id, player_id);
            if (result === serverResponses_1.ServerResponses.NotFound ||
                result === roomResponses_1.RoomResponses.BannedPlayerNotFound)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, result);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, roomResponses_1.RoomResponses.PlayerUbanned, result);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    }
};
//# sourceMappingURL=roomController.js.map