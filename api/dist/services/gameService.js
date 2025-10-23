"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const gameStatus_1 = require("../utils/game/gameStatus");
const movementsEnum_1 = require("../utils/game/movementsEnum");
const gameResponses_1 = require("../utils/responses/gameResponses");
const serverResponses_1 = require("../utils/responses/serverResponses");
const logEnum_1 = require("../utils/server/logEnum");
const logger_1 = require("../utils/server/logger");
const roomService_1 = require("./roomService");
const movements_1 = require("../utils/game/movements");
const gameSocket_1 = require("../utils/socket/gameSocket");
exports.GameService = {
    startGame(room_id, theme, gamemode, allowedPowers) {
        const game = roomService_1.RoomService.getRoom(room_id);
        if (game === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        if (game.timeout)
            clearTimeout(game.timeout);
        const players = game.players;
        if (!players)
            return serverResponses_1.ServerResponses.NotFound;
        if (players.length < 2)
            return gameResponses_1.GameResponses.NotEnoughPlayers;
        game.startGame(theme, gamemode, allowedPowers);
        const first_player = Math.floor(Math.random() * 2);
        players[first_player].turn = 0;
        players[1 - first_player].turn = 1;
        game.setStatus(gameStatus_1.GameStatus.GameRunning);
        (0, logger_1.createLog)(room_id, logEnum_1.LogEnum.GameStarted);
        return gameResponses_1.GameResponses.GameStarted;
    },
    passTurn(room_id, player_id) {
        const game = roomService_1.RoomService.getRoom(room_id);
        if (game === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        const players = game.players;
        const player = players.filter(Boolean).find(p => p.player_id === player_id);
        if (!player)
            return gameResponses_1.GameResponses.GameError;
        player.passed++;
        game.incrementTurn();
        if (player.passed >= 3) {
            const result = roomService_1.RoomService.afkPlayer(room_id, player_id);
            return result;
        }
        ;
        gameSocket_1.GameSocket.passTurn(room_id);
        return gameResponses_1.GameResponses.Continue;
    },
    passTurnEffect(room_id, player_id) {
        const game = roomService_1.RoomService.getRoom(room_id);
        if (game === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        const players = game.players;
        const player = players.filter(Boolean).find(p => p.player_id === player_id);
        if (!player)
            return gameResponses_1.GameResponses.GameError;
        player.decrementEffect();
        game.incrementTurn();
    },
    discardPower(room_id, player_id, powerIdx) {
        const room = roomService_1.RoomService.getRoom(room_id);
        if (room === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        const player = room.players.find(p => p.player_id === player_id);
        if (!player)
            return serverResponses_1.ServerResponses.NotFound;
        player.powers.splice(powerIdx, 1);
        gameSocket_1.GameSocket.discardPower(room_id);
        return room;
    },
    moveGame(room_id, player_id, movement, powerIndex, x, y) {
        const game = roomService_1.RoomService.getRoom(room_id);
        if (game === serverResponses_1.ServerResponses.NotFound)
            return serverResponses_1.ServerResponses.NotFound;
        const players = game.players;
        const board = game.board;
        const player = players.filter(Boolean).find(p => p.player_id === player_id);
        if (player.freeze.active &&
            movement !== movementsEnum_1.MovementsEnum.UNFREEZE &&
            movement !== movementsEnum_1.MovementsEnum.IMMUNITY) {
            player.decrementEffect();
            game.incrementTurn();
            return gameResponses_1.GameResponses.PlayerFrozen;
        }
        player.decrementEffect();
        game.incrementTurn();
        if (powerIndex !== undefined && movement !== movementsEnum_1.MovementsEnum.TRAP) {
            player.powers.splice(powerIndex, 1);
        }
        switch (movement) {
            case movementsEnum_1.MovementsEnum.REVEAL:
                const resultReveal = movements_1.Movements.clickCell(board, x, y, player, room_id);
                return resultReveal;
            case movementsEnum_1.MovementsEnum.BLOCK:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Blocked} (${x}, ${y})`);
                const resultBlock = movements_1.Movements.blockCell(board, x, y, player_id);
                return resultBlock;
            case movementsEnum_1.MovementsEnum.UNBLOCK:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Unblocked} (${x}, ${y})`);
                const resultUnblock = movements_1.Movements.unblockCell(board, x, y, player, room_id);
                return resultUnblock;
            case movementsEnum_1.MovementsEnum.TRAP:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Trapped} (${x}, ${y})`);
                const resultTrap = movements_1.Movements.trapCell(board, x, y, player, room_id, powerIndex);
                return resultTrap;
            case movementsEnum_1.MovementsEnum.DETECT_TRAPS:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Detect}`);
                const resultDetect = movements_1.Movements.detectTraps(board, player_id);
                return resultDetect;
            case movementsEnum_1.MovementsEnum.FREEZE:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Freeze} ${players.filter(Boolean).find(p => p.player_id !== player.player_id)?.nickname}`);
                const resultFreeze = movements_1.Movements.effectMove(players, player_id, movementsEnum_1.MovementsEnum.FREEZE);
                return resultFreeze;
            case movementsEnum_1.MovementsEnum.UNFREEZE:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Unfreeze} ${player.nickname}`);
                const resultUnfreeze = movements_1.Movements.effectMove(players, player_id, movementsEnum_1.MovementsEnum.UNFREEZE);
                return resultUnfreeze;
            case movementsEnum_1.MovementsEnum.SPY:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Spied} (${x}, ${y})`);
                const resultSpy = movements_1.Movements.spy(board, x, y, player_id);
                return resultSpy;
            case movementsEnum_1.MovementsEnum.BLIND:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Blinded} ${players.filter(Boolean).find(p => p.player_id !== player.player_id)?.nickname}`);
                const resultBlind = movements_1.Movements.effectMove(players, player_id, movementsEnum_1.MovementsEnum.BLIND);
                return resultBlind;
            case movementsEnum_1.MovementsEnum.LANTERN:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Lantern}`);
                const resultLantern = movements_1.Movements.effectMove(players, player_id, movementsEnum_1.MovementsEnum.LANTERN);
                return resultLantern;
            case movementsEnum_1.MovementsEnum.IMMUNITY:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.Immunity}`);
                const resultImmunity = movements_1.Movements.effectMove(players, player_id, movementsEnum_1.MovementsEnum.IMMUNITY);
                return resultImmunity;
            default:
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.InvalidMovement}`);
                return gameResponses_1.GameResponses.InvalidMovement;
        }
    }
};
//# sourceMappingURL=gameService.js.map