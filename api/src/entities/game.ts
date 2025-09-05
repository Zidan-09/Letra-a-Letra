import { GameStatus } from "../utils/game_utils/gameStatus";
import { Board } from "./board";
import { Player } from "./player";

export class Game {
    room_id: string;
    status: GameStatus;
    players: Player[];
    turn: number;
    board: Board;

    constructor(room_id: string, status: GameStatus, players: Player[], board: Board) {
        this.room_id = room_id;
        this.status = status;
        this.players = players;
        this.turn = 0;
        this.board = board;
    }
}