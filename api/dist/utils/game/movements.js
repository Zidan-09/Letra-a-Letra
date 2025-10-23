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
            return gameResponses_1.GameResponses.GameError;
        if (cell.revealed)
            return gameResponses_1.GameResponses.AlmostRevealed;
        if (cell.blocked.status) {
            if (cell.blocked.blocked_by === player.player_id)
                return gameResponses_1.GameResponses.InvalidMovement;
            cell.clicks++;
            if (cell.clicks >= 3) {
                cell.resetCell();
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) and unblocked cell`);
                cell.revealed = true;
                const result = (0, checkCompletedWord_1.checkWordCompletion)(board, x, y);
                if (result) {
                    (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
                    board.finded++;
                    (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
                    player.addScore();
                    return {
                        status: gameResponses_1.GameResponses.Unblocked,
                        letter: cell.letter,
                        cell: cell.position,
                        power: cell.power,
                        completedWord: { word: result.completedWord, positions: result.positions }
                    };
                }
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}'`);
                (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
                return {
                    status: gameResponses_1.GameResponses.Revealed,
                    letter: cell.letter,
                    cell: cell.position,
                    power: cell.power
                };
            }
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) but cell stil blocked - ${3 - cell.clicks} to unblock`);
            return {
                status: gameResponses_1.GameResponses.Blocked,
                cell: cell.position,
                remaining: 3 - cell.clicks
            };
        }
        if (cell.trapped.status) {
            if (cell.trapped.trapped_by === player.player_id) {
                cell.resetCell();
            }
            else {
                cell.resetCell();
                (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - trapped cell`);
                return {
                    status: gameResponses_1.GameResponses.TrapTrigged,
                    cell: cell.position,
                    trapped_by: cell.trapped.trapped_by
                };
            }
            ;
        }
        cell.revealed = true;
        const result = (0, checkCompletedWord_1.checkWordCompletion)(board, x, y);
        if (result) {
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
            board.finded++;
            (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
            player.addScore();
            return {
                status: gameResponses_1.GameResponses.Revealed,
                letter: cell.letter,
                cell: cell.position,
                power: cell.power,
                completedWord: { word: result.completedWord, positions: result.positions }
            };
        }
        (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}'`);
        (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
        return {
            status: gameResponses_1.GameResponses.Revealed,
            letter: cell.letter,
            cell: cell.position,
            power: cell.power
        };
    },
    blockCell(board, x, y, player_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GameError;
        if (cell.revealed)
            return gameResponses_1.GameResponses.AlmostRevealed;
        if (cell.blocked.status)
            return gameResponses_1.GameResponses.AlmostBlocked;
        cell.blocked = { status: true, blocked_by: player_id };
        return {
            status: gameResponses_1.GameResponses.Blocked,
            blocked_by: player_id,
            remaining: 3,
            cell: cell.position
        };
    },
    unblockCell(board, x, y, player, room_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GameError;
        if (cell.revealed)
            return gameResponses_1.GameResponses.AlmostRevealed;
        if (!cell.blocked.status || cell.blocked.blocked_by === player.player_id)
            return gameResponses_1.GameResponses.InvalidMovement;
        cell.resetCell();
        cell.revealed = true;
        const result = (0, checkCompletedWord_1.checkWordCompletion)(board, x, y);
        if (result) {
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
            board.finded++;
            (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
            player.addScore();
            return {
                status: gameResponses_1.GameResponses.Unblocked,
                letter: cell.letter,
                cell: cell.position,
                power: cell.power,
                completedWord: { word: result.completedWord, positions: result.positions }
            };
        }
        (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}'`);
        (0, assignPowerToPlayer_1.assignPowerToPlayer)(cell, player);
        return {
            status: gameResponses_1.GameResponses.Revealed,
            letter: cell.letter,
            cell: cell.position,
            power: cell.power
        };
    },
    trapCell(board, x, y, player, room_id, powerIdx) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GameError;
        if (cell.revealed)
            return gameResponses_1.GameResponses.AlmostRevealed;
        if (cell.trapped.status && cell.trapped.trapped_by === player.player_id)
            return gameResponses_1.GameResponses.AlmostTrapped;
        if (cell.trapped.status && cell.trapped.trapped_by !== player.player_id) {
            cell.resetCell();
            (0, logger_1.createLog)(room_id, `${player.nickname} ${logEnum_1.LogEnum.ClickOn} (${x}, ${y}) - trapped cell`);
            return {
                status: gameResponses_1.GameResponses.TrapTrigged,
                cell: cell.position,
                trapped_by: cell.trapped.trapped_by
            };
        }
        cell.trapped = { status: true, trapped_by: player.player_id };
        player.powers.splice(powerIdx, 1);
        return {
            status: gameResponses_1.GameResponses.Trapped,
            trapped_by: player.player_id,
            cell: cell.position
        };
    },
    detectTraps(board, player_id) {
        const trappedCells = [];
        let trappedBy = undefined;
        board.grid.forEach(row => row.forEach(cell => {
            if (cell.trapped.status && cell.trapped.trapped_by !== player_id) {
                trappedCells.push(cell.position);
                if (!trappedBy) {
                    trappedBy = cell.trapped.trapped_by;
                }
            }
        }));
        return {
            status: gameResponses_1.GameResponses.DetectedTraps,
            traps: trappedCells,
            trapped_by: trappedBy
        };
    },
    effectMove(players, player_id, effect) {
        let player;
        switch (effect) {
            case movementsEnum_1.MovementsEnum.FREEZE:
                player = players.filter(Boolean).find(p => p.player_id !== player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GameError;
                if (player.immunity.active)
                    return gameResponses_1.GameResponses.Immunity;
                player.applyEffect("freeze", 3);
                return {
                    status: gameResponses_1.GameResponses.Frozen,
                    player: player.player_id
                };
            case movementsEnum_1.MovementsEnum.UNFREEZE:
                player = players.filter(Boolean).find(p => p.player_id === player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GameError;
                player.removeEffect("freeze");
                return {
                    status: gameResponses_1.GameResponses.Unfrozen,
                    player: player.player_id
                };
            case movementsEnum_1.MovementsEnum.BLIND:
                player = players.filter(Boolean).find(p => p.player_id !== player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GameError;
                if (player.immunity.active)
                    return gameResponses_1.GameResponses.Immunity;
                player.applyEffect("blind", 3);
                return {
                    status: gameResponses_1.GameResponses.Blinded,
                    player: player.player_id
                };
            case movementsEnum_1.MovementsEnum.LANTERN:
                player = players.filter(Boolean).find(p => p.player_id === player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GameError;
                player.removeEffect("blind");
                return {
                    status: gameResponses_1.GameResponses.Lantern,
                    player: player.player_id
                };
            case movementsEnum_1.MovementsEnum.IMMUNITY:
                player = players.filter(Boolean).find(p => p.player_id === player_id);
                if (!player)
                    return gameResponses_1.GameResponses.GameError;
                player.applyEffect("immunity", 5);
                player.removeEffect("blind");
                player.removeEffect("freeze");
                return {
                    status: gameResponses_1.GameResponses.Immunity,
                    player: player.player_id
                };
            default:
                return gameResponses_1.GameResponses.GameError;
        }
    },
    spy(board, x, y, player_id) {
        const cell = board.grid[x][y];
        if (!cell)
            return gameResponses_1.GameResponses.GameError;
        if (cell.revealed)
            return gameResponses_1.GameResponses.AlmostRevealed;
        return {
            status: gameResponses_1.GameResponses.Spied,
            for: player_id,
            letter: cell.letter,
            cell: cell.position
        };
    },
};
//# sourceMappingURL=movements.js.map