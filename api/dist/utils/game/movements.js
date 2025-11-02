"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movements = void 0;
const gameResponses_1 = require("../responses/gameResponses");
const logEnum_1 = require("../server/logEnum");
const logger_1 = require("../server/logger");
const checkCompletedWord_1 = require("../board/checkCompletedWord");
const movementsEnum_1 = require("./movementsEnum");
const assignPowerToPlayer_1 = require("./assignPowerToPlayer");
exports.Movements = {
    clickCell(board, x, y, player, room_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GAME_ERROR;
        if (cell.revealed.status)
            return gameResponses_1.GameResponses.ALMOST_REVEALED;
        if (cell.blocked.status) {
            if (cell.blocked.blocked_by === player.player_id)
                return gameResponses_1.GameResponses.INVALID_MOVEMENT;
            cell.clicks++;
            if (cell.clicks >= 3) {
                cell.resetCell();
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) and unblocked cell`);
                cell.revealed = { status: true, revealed_by: player.player_id };
                const result = (0, checkCompletedWord_1.checkWordCompletion)(board, x, y);
                if (result) {
                    (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
                    board.finded++;
                    (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
                    player.addScore();
                    return {
                        status: gameResponses_1.GameResponses.UNBLOCKED,
                        letter: cell.letter,
                        cell: cell.position,
                        power: cell.power,
                        completedWord: {
                            word: result.completedWord,
                            positions: result.positions,
                        },
                    };
                }
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - reveal letter: '${cell.letter}'`);
                (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
                return {
                    status: gameResponses_1.GameResponses.REVEALED,
                    letter: cell.letter,
                    cell: cell.position,
                    power: cell.power,
                };
            }
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) but cell stil blocked - ${3 - cell.clicks} to unblock`);
            return {
                status: gameResponses_1.GameResponses.BLOCKED,
                cell: cell.position,
                remaining: 3 - cell.clicks,
            };
        }
        if (cell.trapped.status) {
            if (cell.trapped.trapped_by === player.player_id) {
                cell.resetCell();
            }
            else {
                cell.resetCell();
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - trapped cell`);
                return {
                    status: gameResponses_1.GameResponses.TRAP_TRIGGED,
                    cell: cell.position,
                    trapped_by: cell.trapped.trapped_by,
                };
            }
        }
        cell.revealed = { status: true, revealed_by: player.player_id };
        const result = (0, checkCompletedWord_1.checkWordCompletion)(board, x, y);
        if (result) {
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
            board.finded++;
            (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
            player.addScore();
            return {
                status: gameResponses_1.GameResponses.REVEALED,
                letter: cell.letter,
                cell: cell.position,
                power: cell.power,
                completedWord: {
                    word: result.completedWord,
                    positions: result.positions,
                },
            };
        }
        (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - reveal letter: '${cell.letter}'`);
        (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
        return {
            status: gameResponses_1.GameResponses.REVEALED,
            letter: cell.letter,
            cell: cell.position,
            power: cell.power,
        };
    },
    blockCell(board, x, y, player_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GAME_ERROR;
        if (cell.revealed.status)
            return gameResponses_1.GameResponses.ALMOST_REVEALED;
        if (cell.blocked.status)
            return gameResponses_1.GameResponses.ALMOST_BLOCKED;
        cell.blocked = { status: true, blocked_by: player_id };
        return {
            status: gameResponses_1.GameResponses.BLOCKED,
            blocked_by: player_id,
            remaining: 3,
            cell: cell.position,
        };
    },
    unblockCell(board, x, y, player, room_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GAME_ERROR;
        if (cell.revealed.status)
            return gameResponses_1.GameResponses.ALMOST_REVEALED;
        if (!cell.blocked.status || cell.blocked.blocked_by === player.player_id)
            return gameResponses_1.GameResponses.INVALID_MOVEMENT;
        cell.resetCell();
        cell.revealed = { status: true, revealed_by: player.player_id };
        const result = (0, checkCompletedWord_1.checkWordCompletion)(board, x, y);
        if (result) {
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
            board.finded++;
            (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
            player.addScore();
            return {
                status: gameResponses_1.GameResponses.UNBLOCKED,
                letter: cell.letter,
                cell: cell.position,
                power: cell.power,
                completedWord: {
                    word: result.completedWord,
                    positions: result.positions,
                },
            };
        }
        (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - reveal letter: '${cell.letter}'`);
        (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
        return {
            status: gameResponses_1.GameResponses.REVEALED,
            letter: cell.letter,
            cell: cell.position,
            power: cell.power,
        };
    },
    trapCell(board, x, y, player, room_id, powerIdx) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GAME_ERROR;
        if (cell.revealed.status)
            return gameResponses_1.GameResponses.ALMOST_REVEALED;
        if (cell.trapped.status && cell.trapped.trapped_by === player.player_id)
            return gameResponses_1.GameResponses.ALMOST_TRAPPED;
        if (cell.trapped.status && cell.trapped.trapped_by !== player.player_id) {
            cell.resetCell();
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.CLICKON} (${x}, ${y}) - trapped cell`);
            return {
                status: gameResponses_1.GameResponses.TRAP_TRIGGED,
                cell: cell.position,
                trapped_by: cell.trapped.trapped_by,
            };
        }
        cell.trapped = { status: true, trapped_by: player.player_id };
        player.powers.splice(powerIdx, 1);
        return {
            status: gameResponses_1.GameResponses.TRAPPED,
            trapped_by: player.player_id,
            cell: cell.position,
        };
    },
    detectTraps(board, player_id) {
        const trappedCells = [];
        let trappedBy = undefined;
        board.grid.forEach((row) => row.forEach((cell) => {
            if (cell.trapped.status && cell.trapped.trapped_by !== player_id) {
                trappedCells.push(cell.position);
                if (!trappedBy) {
                    trappedBy = cell.trapped.trapped_by;
                }
            }
        }));
        return {
            status: gameResponses_1.GameResponses.DETECTED_TRAPS,
            traps: trappedCells,
            trapped_by: trappedBy,
        };
    },
    effectMove(players, player_id, effect) {
        let player;
        switch (effect) {
            case movementsEnum_1.MovementsEnum.FREEZE:
                player = players.filter(Boolean).find((p) => p.player_id !== player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GAME_ERROR;
                if (player.immunity.active)
                    return gameResponses_1.GameResponses.IMMUNITY;
                player.applyEffect("freeze", 3);
                return {
                    status: gameResponses_1.GameResponses.FROZEN,
                    player: player.player_id,
                };
            case movementsEnum_1.MovementsEnum.UNFREEZE:
                player = players.filter(Boolean).find((p) => p.player_id === player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GAME_ERROR;
                player.removeEffect("freeze");
                return {
                    status: gameResponses_1.GameResponses.UNFROZEN,
                    player: player.player_id,
                };
            case movementsEnum_1.MovementsEnum.BLIND:
                player = players.filter(Boolean).find((p) => p.player_id !== player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GAME_ERROR;
                if (player.immunity.active)
                    return gameResponses_1.GameResponses.IMMUNITY;
                player.applyEffect("blind", 3);
                return {
                    status: gameResponses_1.GameResponses.BLINDED,
                    player: player.player_id,
                };
            case movementsEnum_1.MovementsEnum.LANTERN:
                player = players.filter(Boolean).find((p) => p.player_id === player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GAME_ERROR;
                player.removeEffect("blind");
                return {
                    status: gameResponses_1.GameResponses.LANTERN,
                    player: player.player_id,
                };
            case movementsEnum_1.MovementsEnum.IMMUNITY:
                player = players.filter(Boolean).find((p) => p.player_id === player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GAME_ERROR;
                player.applyEffect("immunity", 5);
                player.removeEffect("blind");
                player.removeEffect("freeze");
                return {
                    status: gameResponses_1.GameResponses.IMMUNITY,
                    player: player.player_id,
                };
            default:
                return gameResponses_1.GameResponses.GAME_ERROR;
        }
    },
    spy(board, x, y, player_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GAME_ERROR;
        if (cell.revealed.status)
            return gameResponses_1.GameResponses.ALMOST_REVEALED;
        return {
            status: gameResponses_1.GameResponses.SPIED,
            for: player_id,
            letter: cell.letter,
            cell: cell.position,
        };
    },
};
//# sourceMappingURL=movements.js.map