import { GameStatus } from "../utils/game_utils/gameStatus";
import { Board } from "./board";
import { Player } from "./player";

export interface Game {
    room_id: string;
    status: GameStatus;
    players: Player[];
    turn: number;
    board: Board;
}