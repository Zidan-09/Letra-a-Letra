import { MovementsEnum } from "../utils/board_utils/movementsEnum";
import { Themes } from "../utils/board_utils/themesEnum";
import { GameModes } from "../utils/game_utils/gameModes";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { LogEnum } from "../utils/server_utils/logEnum";
import { createLog } from "../utils/server_utils/logs";
import { Board } from "./board";
import { Player } from "./player";

export class Game {
    room_id: string;
    room_name: string;
    status: GameStatus;
    players: Player[];
    spectators: Player[] = [];
    created_by: string;
    timer: number;
    turn: number;
    board: Board | null;
    allowSpectators: boolean;
    privateRoom: boolean;

    constructor(room_id: string, room_name: string, status: GameStatus, player: Player, timer: number, allowSpectators: boolean, privateRoom: boolean) {
        this.room_id = room_id;
        this.room_name = room_name;
        this.status = status;
        this.players = [player];
        this.created_by = player.nickname;
        this.timer = timer;
        this.turn = 0;
        this.board = null;
        this.allowSpectators = allowSpectators;
        this.privateRoom = privateRoom;
    }

    public startGame(theme: Themes, gamemode: GameModes, allowedPowers: MovementsEnum[]) {
        this.board = new Board(theme, gamemode, allowedPowers);
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

       this.status = GameStatus.GameOver;
       createLog(this.room_id, `${LogEnum.GameOver}`);

       if (!p1 || !p2) return (p1 || p2) ?? false;

       return p1.score > p2.score ? p1 : p2;
    }
}