import { Board } from "./board";
import { Player } from "./player";

export interface Game {
    id: string;
    players: Player[];
    turn: number;
    board: Board;
}