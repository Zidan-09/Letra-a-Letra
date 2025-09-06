import { GameStatus } from "../utils/game_utils/gameStatus";
import { Board } from "./board";
import { Player } from "./player";

export class Game {
    private room_id: string;
    private status: GameStatus;
    private players: Player[];
    private turn: number;
    private board: Board | null;

    constructor(room_id: string, status: GameStatus, players: Player[]) {
        this.room_id = room_id;
        this.status = status;
        this.players = players;
        this.turn = 0;
        this.board = null;
    }

    public startGame(board: Board) {
        this.board = board;
        this.turn = 0;
    }

    public getRoomId() {
        return this.room_id;
    }

    public getPlayers() {
        return this.players;
    }

    public setStatus(status: GameStatus) {
        this.status = status;
    }

    public getStatus() {
        return this.status;
    }

    public getTurn() {
        return this.turn;
    }

    public icrementTurn() {
        this.turn++;
    }

    public getBoard() {
        return this.board;
    }

    public gameOver() {
        if (this.turn === 100) {
            this.status = GameStatus.GameOver;

            const player_1 = this.players[0];

            if (player_1!.score > this.players[1]!.score) return player_1!;
            return this.players[1]!;
        }

        return false;
    }
}