import { Player } from "../../entities/player";
import { MovementsEnum } from "../board_utils/movementsEnum";
import { GameResponses } from "../responses/gameResponses";

interface GameStarted {
    first: Player;
    words: string[];
}

interface MoveEmit {
    status: GameResponses;
    cell?: { x: number, y: number };
    remaining?: number;
    letter?: string;
    completedWord?: string;
    blocked_by?: string;
    trapped_by?: string;
    traps?: { x: number, y: number }[];
    player?: string;
    for?: string;
    power?: { hasPowerup: boolean, powerup: MovementsEnum | null }
}

export { GameStarted, MoveEmit }