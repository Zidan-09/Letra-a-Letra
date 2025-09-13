import { Themes } from "../utils/board_utils/themesEnum";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { Board } from "./board";
import { Player } from "./player";

export class Game {
    room_id: string;
    status: GameStatus;
    players: Player[];
    turn: number;
    board: Board | null;
    privateRoom: boolean;

    constructor(room_id: string, status: GameStatus, players: Player[], privateRoom: boolean) {
        this.room_id = room_id;
        this.status = status;
        this.players = players;
        this.turn = 0;
        this.board = null;
        this.privateRoom = privateRoom;
    }

    public startGame(theme: Themes) {
        this.board = new Board(theme);
        this.turn = 0;
        this.status = GameStatus.GameRunning;
    }

    public setStatus(status: GameStatus) {
        this.status = status;
    }

    public incrementTurn() {
        this.turn++;
    }

    gameOver(): Player | false {
       const [p1, p2] = this.players;

       if (!this.board || (this.board.finded < this.board.words.length && p1 && p2)) return false;

       if (!p1 || !p2) return (p1 || p2) ?? false;

       return p1.score > p2.score ? p1 : p2;
    }
}