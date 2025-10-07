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
    players: Player[] = Array(2).fill(undefined);
    spectators: Player[] = Array(5).fill(undefined);
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
        this.created_by = player.nickname;
        this.timer = timer;
        this.turn = 0;
        this.board = null;
        this.allowSpectators = allowSpectators;
        this.privateRoom = privateRoom;
        this.players[0] = player;
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

        if (!this.board || !p1 || !p2 || (p1.score < 3 && p2.score < 3)) return false;

        this.status = GameStatus.GameOver;
        createLog(this.room_id, LogEnum.GameOver);
        this.board = null;

        return p1.score > p2.score ? p1 : p2;
    }

}