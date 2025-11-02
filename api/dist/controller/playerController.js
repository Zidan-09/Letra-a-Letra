"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const playerService_1 = require("../services/playerService");
const handleResponse_1 = require("../utils/server/handleResponse");
const serverResponses_1 = require("../utils/responses/serverResponses");
const playerResponses_1 = require("../utils/responses/playerResponses");
exports.PlayerController = {
    createPlayer(req, res) {
        const { player_id, nickname, avatar } = req.body;
        try {
            const player = playerService_1.PlayerService.createPlayer(player_id, nickname, false, avatar);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, playerResponses_1.PlayerResponses.PLAYER_CREATED, player);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    getPlayer(req, res) {
        const { player_id } = req.params;
        try {
            const player = playerService_1.PlayerService.getPlayer(player_id);
            if (player !== serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 200, true, playerResponses_1.PlayerResponses.PLAYER_FOUND, player);
            return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    getAllPlayers(req, res) {
        try {
            const players = playerService_1.PlayerService.getAll();
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, playerResponses_1.PlayerResponses.ALL_PLAYERS, players);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    deletePlayer(req, res) {
        const { player_id } = req.params;
        try {
            const result = playerService_1.PlayerService.removePlayer(player_id);
            if (result)
                return handleResponse_1.HandleResponse.serverResponse(res, 200, true, playerResponses_1.PlayerResponses.PLAYER_DELETED);
            handleResponse_1.HandleResponse.serverResponse(res, 400, false, playerResponses_1.PlayerResponses.PLAYER_DELETED_FAILED);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
};
//# sourceMappingURL=playerController.js.map