"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMiddleware = void 0;
const handleResponse_1 = require("../utils/server/handleResponse");
const playerService_1 = require("../services/playerService");
const serverResponses_1 = require("../utils/responses/serverResponses");
exports.PlayerMiddleware = {
    createPlayer(req, res, next) {
        const { player_id, nickname, avatar } = req.body;
        try {
            if (!player_id || !nickname || !avatar || nickname.length > 10)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    getPlayer(req, res, next) {
        const { player_id } = req.params;
        try {
            if (!player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    deletePlayer(req, res, next) {
        const { player_id } = req.params;
        try {
            if (!player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const player = playerService_1.PlayerService.getPlayer(player_id);
            if (player === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
};
//# sourceMappingURL=playerMiddleware.js.map