import { Board } from "../../entities/board"
import { Player } from "../../entities/player";
import { MoveEmit } from "../emits/gameEmits";
import { GameResponses } from "../responses/gameResponses";
import { checkWordCompletion } from "./checkCompletedWord";

export const Movements = {
    clickCell(board: Board, x: number, y: number, player_id: string): GameResponses | MoveEmit {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        if (cell.blocked.status) {
            if (cell.blocked.blocked_by === player_id) return GameResponses.InvalidMovement;

            cell.clicks++;

            if (cell.clicks >= 3) {
                cell.resetCell();

                return {
                    status: GameResponses.Unblocked,
                    cell: cell.position,
                    remaining: cell.clicks
                }
            }
            
            return {
                status: GameResponses.Blocked,
                cell: cell.position,
                remaining: cell.clicks
            }
        }

        if (cell.trapped.status) {
            if (cell.trapped.trapped_by === player_id) return GameResponses.InvalidMovement;
            cell.resetCell();

            return {
                status: GameResponses.Trapped,
                cell: cell.position
            }
        }

        cell.revealed = true;
        const result = checkWordCompletion(board, x, y);

        if (result) return {
            status: GameResponses.Revealed,
            letter: cell.letter,
            completedWord: result.completedWord
        }

        return {
            status: GameResponses.Revealed,
            letter: cell.letter
        };
    },

    blockCell(board: Board, x: number, y: number, player_id: string): GameResponses | MoveEmit {
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

    unblockCell(board: Board, x: number, y: number, player_id: string): GameResponses | MoveEmit {
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

    freeze(players: Player[], player_id: string): GameResponses | MoveEmit {
        const player = players.find(p =>
            p.player_id !== player_id
        )

        if (!player) return GameResponses.GameError;

        player.freeze = true;

        return {
            status: GameResponses.Freezed,
            player: player.player_id
        }
    },

    unfreeze(players: Player[], player_id: string): GameResponses | MoveEmit {
        const player = players.find(p =>
            p.player_id === player_id
        )

        if (!player) return GameResponses.GameError;

        player.freeze = false;

        return {
            status: GameResponses.Unfreezed,
            player: player.player_id
        }
    },

    spy(board: Board, x: number, y: number, player_id: string): GameResponses | MoveEmit {
        const cell = board.grid[x]![y];
        if (!cell) return GameResponses.GameError;
        if (cell.revealed) return GameResponses.AlmostRevealed;

        return {
            status: GameResponses.Spied,
            for: player_id,
            letter: cell.letter
        }
    }
}