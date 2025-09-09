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
            const player_2 = this.players[1];
            if (!player_1 || !player_2) return false;

            if (player_1.score > player_2.score) return player_1;
            return player_2;
            
        } else if (this.players.length < 2) {
            this.status = GameStatus.GameOver;

            const player = this.players[0];
            if (!player) return false;

            return player;
        }

        return false;
    }
}