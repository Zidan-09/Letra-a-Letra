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

    public icrementTurn() {
        this.turn++;
    }

    gameOver(): Player | null {
       const [p1, p2] = this.players;

       if (this.turn < 100 && p1 && p2) return null;

       if (!p1 || !p2) return (p1 || p2) ?? null;

       return p1.score > p2.score ? p1 : p2;
    }
}