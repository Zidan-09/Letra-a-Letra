import { Board } from "../../entities/board"
import { Player } from "../../entities/player";
import { MoveEmit } from "../emits/gameEmits";
import { GameResponses } from "../responses/gameResponses";
import { LogEnum } from "../server_utils/logEnum";
import { createLog } from "../server_utils/logs";
import { checkWordCompletion } from "./checkCompletedWord";
import { MovementsEnum } from "./movementsEnum";
import { assignPowerToPlayer } from "./assignPowerToPlayer";

export const Movements = {
    clickCell(board: Board, x: number, y: number, player: Player, room_id: string): MoveEmit | GameResponses {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        if (cell.blocked.status) {
            if (cell.blocked.blocked_by === player.player_id) return GameResponses.InvalidMovement;

            cell.clicks++;

            if (cell.clicks >= 3) {
                cell.resetCell();

                createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) and unblocked cell`);

                cell.revealed = true;
                const result = checkWordCompletion(board, x, y);

                if (result) {

                    createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
                    board.finded++;
                    
                    assignPowerToPlayer(cell, player);

                    return {
                        status: GameResponses.Unblocked,
                        letter: cell.letter,
                        cell: cell.position,
                        power: cell.power,
                        completedWord: { word: result.completedWord, positions: result.positions }
                    }
                }

                createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}'`);

                assignPowerToPlayer(cell, player);

                return {
                    status: GameResponses.Revealed,
                    letter: cell.letter,
                    cell: cell.position,
                    power: cell.power
                };
            }

            createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) but cell stil blocked - ${3 - cell.clicks} to unblock`);

            return {
                status: GameResponses.Blocked,
                cell: cell.position,
                remaining: 3 -cell.clicks
            }
        }

        if (cell.trapped.status) {
            if (cell.trapped.trapped_by === player.player_id) return GameResponses.InvalidMovement;
            cell.resetCell();

            createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) - trapped cell`);

            return {
                status: GameResponses.Trapped,
                cell: cell.position
            }
        }

        cell.revealed = true;
        const result = checkWordCompletion(board, x, y);

        
        if (result) {

            createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}' - completed word: ${result.completedWord}`);
            board.finded++;
            
            assignPowerToPlayer(cell, player);

            return {
                status: GameResponses.Revealed,
                letter: cell.letter,
                cell: cell.position,
                power: cell.power,
                completedWord: { word: result.completedWord, positions: result.positions }
            }
        }

        createLog(room_id, `${player.nickname} ${LogEnum.ClickOn} (${x}, ${y}) - reveal letter: '${cell.letter}'`);

        assignPowerToPlayer(cell, player);

        return {
            status: GameResponses.Revealed,
            letter: cell.letter,
            cell: cell.position,
            power: cell.power
        };
    },

    blockCell(board: Board, x: number, y: number, player_id: string): MoveEmit | GameResponses {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        if (cell.blocked.status) return GameResponses.AlmostBlocked;

        cell.blocked = { status: true, blocked_by: player_id };

        return {
            status: GameResponses.Blocked,
            blocked_by: player_id,
            cell: cell.position
        }
    },

    unblockCell(board: Board, x: number, y: number, player_id: string): MoveEmit | GameResponses {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        if (!cell.blocked.status || cell.blocked.blocked_by === player_id) return GameResponses.InvalidMovement;

        cell.resetCell();

        return {
            status: GameResponses.Unblocked,
            cell: cell.position
        }
    },

    trapCell(board: Board, x: number, y: number, player_id: string): GameResponses | MoveEmit {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        if (cell.trapped.status && cell.trapped.trapped_by === player_id) return GameResponses.AlmostTrapped;

        cell.trapped = { status: true, trapped_by: player_id }

        return {
            status: GameResponses.Trapped,
            trapped_by: player_id,
            cell: cell.position
        }
    },

    detectTraps(board: Board, player_id: string): GameResponses | MoveEmit {
        const trappedCells: { x: number, y: number }[] = [];

        board.grid.forEach(row => 
            row.forEach(cell => {
                if (cell.trapped.status && cell.trapped.trapped_by !== player_id) {
                    trappedCells.push(cell.position);
                }
            })
        )

        return {
            status: GameResponses.DetectedTraps,
            traps: trappedCells
        }
    },

    effectMove(players: Player[], player_id: string, effect: MovementsEnum): MoveEmit | GameResponses {
        let player: Player | undefined;
        
        switch (effect) {
            case MovementsEnum.FREEZE:
                player = players.filter(Boolean).find(p => p.player_id !== player_id);
                if (!player) return GameResponses.GameError;

                player.applyEffect("freeze", 3);

                return {
                    status: GameResponses.Frozen,
                    player: player.player_id
                }

            case MovementsEnum.UNFREEZE:
                player = players.filter(Boolean).find(p => p.player_id === player_id);
                if (!player) return GameResponses.GameError;
                
                player.removeEffect("freeze");

                return {
                    status: GameResponses.Unfrozen,
                    player: player.player_id
                }

            case MovementsEnum.BLIND:
                player = players.filter(Boolean).find(p => p.player_id !== player_id);
                if (!player) return GameResponses.GameError;

                player.applyEffect("blind", 3);

                return {
                    status: GameResponses.Blinded,
                    player: player.player_id
                }

            case MovementsEnum.LANTERN:
                player = players.filter(Boolean).find(p => p.player_id === player_id);
                if (!player) return GameResponses.GameError;

                player.removeEffect("blind");

                return {
                    status: GameResponses.Lantern,
                    player: player.player_id
                }

            case MovementsEnum.IMMUNITY:
                player = players.filter(Boolean).find(p => p.player_id === player_id);
                if (!player) return GameResponses.GameError;

                player.applyEffect("immunity", 5);

                return {
                    status: GameResponses.Immunity,
                    player: player.player_id
                }
            default:
                return GameResponses.GameError;
        }
    },

    spy(board: Board, x: number, y: number, player_id: string): MoveEmit | GameResponses {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        return {
            status: GameResponses.Spied,
            for: player_id,
            letter: cell.letter,
            cell: cell.position
        }
    },
}