"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMiddleware = void 0;
const handleResponse_1 = require("../utils/server/handleResponse");
const gameResponses_1 = require("../utils/responses/gameResponses");
const roomService_1 = require("../services/roomService");
const serverResponses_1 = require("../utils/responses/serverResponses");
const gameStatus_1 = require("../utils/game/gameStatus");
const movementsEnum_1 = require("../utils/game/movementsEnum");
const themesEnum_1 = require("../utils/board/themesEnum");
const gameModes_1 = require("../utils/game/gameModes");
const powerRarity_1 = require("../utils/cell/powerRarity");
exports.GameMiddleware = {
    startGame(req, res, next) {
        const { room_id } = req.params;
        const { theme, gamemode, allowedPowers } = req.body;
        try {
            if (!room_id || !theme || !gamemode || !allowedPowers)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game == serverResponses_1.ServerResponses.NOT_FOUND ||
                game.status === gameStatus_1.GameStatus.GameRunning)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            if (!Object.values(themesEnum_1.Themes).includes(theme))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.INVALID_THEME);
            const powers = Object.values(movementsEnum_1.MovementsEnum);
            if (allowedPowers.some((power) => !powers.includes(power)))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            const gameModes = Object.values(gameModes_1.GameModes);
            if (!gameModes.includes(gamemode))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    validateMovement(req, res, next) {
        const { room_id } = req.params;
        const { player_id, movement, powerIndex, x, y } = req.body;
        try {
            if (!room_id || !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.NOT_FOUND);
            const players = game.players;
            if (!players?.length)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.NOT_FOUND);
            const board = game.board;
            if (game.status !== gameStatus_1.GameStatus.GameRunning)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            if (!board?.grid[x] || (board.grid[x] && !board.grid[x][y]))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            const player = players
                .filter(Boolean)
                .find((p) => p.player_id === player_id);
            if (!player || !board || player.spectator)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            if (game.turn % 2 !== player.turn)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.INVALID_TURN_ACTION);
            const movements = Object.values(movementsEnum_1.MovementsEnum);
            if (!movements.includes(movement))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.INVALID_MOVEMENT);
            if ((powerIndex !== undefined && 0 > powerIndex) ||
                (powerIndex !== undefined && powerIndex >= 5) ||
                (powerIndex !== undefined &&
                    player.powers[powerIndex]?.power !== movement))
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.INVALID_MOVEMENT);
            if (powerIndex !== undefined &&
                player.powers[powerIndex]?.power &&
                player.powers[powerIndex].power !== movement)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.WITHOUT_POWER);
            if (movement === movementsEnum_1.MovementsEnum.UNBLOCK &&
                !board?.grid[x][y]?.blocked.status)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.CELL_NOT_BLOCKED);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    passTurn(req, res, next) {
        const { room_id } = req.params;
        const { player_id } = req.body;
        try {
            if (!room_id || !player_id)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
            const game = roomService_1.RoomService.getRoom(room_id);
            if (game === serverResponses_1.ServerResponses.NOT_FOUND)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.NOT_FOUND);
            const players = game.players;
            if (!players)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.NOT_FOUND);
            const player = players
                .filter(Boolean)
                .find((p) => p.player_id === player_id);
            if (!player || game.turn % 2 !== player.turn)
                return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
            next();
        }
        catch (err) {
            console.error(err);
            handleResponse_1.HandleResponse.errorResponse(res);
        }
    },
    passBecauseEffect(req, res, next) {
        const { room_id } = req.params;
        const { player_id } = req.body;
        if (!room_id || !player_id)
            return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND)
            return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
        const player = room.players
            .filter(Boolean)
            .find((p) => p.player_id === player_id);
        if (!player)
            return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
        if ((player.freeze.active &&
            player.powers.includes({
                power: movementsEnum_1.MovementsEnum.IMMUNITY,
                rarity: powerRarity_1.PowerRarity.LEGENDARY,
                type: "effect",
            })) ||
            (player.freeze.active &&
                player.powers.includes({
                    power: movementsEnum_1.MovementsEnum.UNFREEZE,
                    rarity: powerRarity_1.PowerRarity.RARE,
                    type: "effect",
                })))
            return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.INVALID_MOVEMENT);
        next();
    },
    discardPower(req, res, next) {
        const { room_id } = req.params;
        const { player_id, power, powerIdx } = req.body;
        if (!room_id || !player_id || !power || powerIdx === undefined)
            return handleResponse_1.HandleResponse.serverResponse(res, 400, false, serverResponses_1.ServerResponses.MISSING_DATA);
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NOT_FOUND)
            return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
        const player = room.players.find((p) => p.player_id === player_id);
        if (!player)
            return handleResponse_1.HandleResponse.serverResponse(res, 404, false, serverResponses_1.ServerResponses.NOT_FOUND);
        if ((powerIdx !== undefined && 0 > powerIdx) ||
            (powerIdx !== undefined && powerIdx >= 5) ||
            player.powers[powerIdx]?.power !== power)
            return handleResponse_1.HandleResponse.serverResponse(res, 400, false, gameResponses_1.GameResponses.GAME_ERROR);
        if (powerIdx < 0 || powerIdx >= player.powers.length)
            return;
        next();
    },
};
//# sourceMappingURL=gameMiddleware.js.map