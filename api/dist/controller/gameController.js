"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameController = void 0;
const handleResponse_1 = require("../utils/server/handleResponse");
const gameService_1 = require("../services/gameService");
const gameResponses_1 = require("../utils/responses/gameResponses");
const serverResponses_1 = require("../utils/responses/serverResponses");
const gameSocket_1 = require("../utils/socket/gameSocket");
const handleSocket_1 = require("../utils/server/handleSocket");
const movementsEnum_1 = require("../utils/game/movementsEnum");
exports.gameController = {
    startGame(req, res) {
        const { room_id } = req.params;
        const { theme, gamemode, allowedPowers } = req.body;
        try {
            const result = gameService_1.GameService.startGame(room_id, theme, gamemode, allowedPowers);
            if (result === gameResponses_1.GameResponses.NOT_ENOUGH_PLAYERS ||
                result === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, result);
            gameSocket_1.GameSocket.gameStarted(room_id);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, result);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    moveGame(req, res) {
        const { room_id } = req.params;
        const { player_id, movement, powerIndex, x, y } = req.body;
        try {
            const result = gameService_1.GameService.moveGame(room_id, player_id, movement, powerIndex, x, y);
            if (typeof result !== "object") {
                if (result === gameResponses_1.GameResponses.IMMUNITY &&
                    movement !== movementsEnum_1.MovementsEnum.IMMUNITY) {
                    (0, handleSocket_1.HandleSocket)(room_id, player_id, movement, { status: gameResponses_1.GameResponses.IMMUNITY });
                    gameSocket_1.GameSocket.gameOver(room_id);
                    return handleResponse_1.HandleResponse.serverResponse(res, 200, true, gameResponses_1.GameResponses.IMMUNITY, movement);
                }
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, result);
            }
            (0, handleSocket_1.HandleSocket)(room_id, player_id, movement, result);
            gameSocket_1.GameSocket.gameOver(room_id);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, result.status);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    passTurn(req, res) {
        const { room_id } = req.params;
        const { player_id } = req.body;
        try {
            const result = gameService_1.GameService.passTurn(room_id, player_id);
            if (result === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (result === gameResponses_1.GameResponses.GAME_ERROR)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            handleResponse_1.HandleResponse.serverResponse(res, 200, true, result);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    passBecauseEffect(req, res) {
        const { room_id } = req.params;
        const { player_id } = req.body;
        try {
            const result = gameService_1.GameService.moveGame(room_id, player_id, movementsEnum_1.MovementsEnum.FREEZE, 0);
            if (result === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            if (result === gameResponses_1.GameResponses.GAME_ERROR)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            if (result === gameResponses_1.GameResponses.PLAYER_FROZEN) {
                (0, handleSocket_1.HandleSocket)(room_id, player_id, movementsEnum_1.MovementsEnum.FREEZE, {
                    status: gameResponses_1.GameResponses.FROZEN,
                });
                return handleResponse_1.HandleResponse.serverResponse(res, 200, true, gameResponses_1.GameResponses.FROZEN);
            }
            handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    discardPower(req, res) {
        const { room_id } = req.params;
        const { player_id, powerIdx } = req.body;
        try {
            const result = gameService_1.GameService.discardPower(room_id, player_id, powerIdx);
            if (result === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
            return handleResponse_1.HandleResponse.serverResponse(res, 200, true, gameResponses_1.GameResponses.POWER_DISCARDED, result);
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
};
//# sourceMappingURL=gameController.js.map