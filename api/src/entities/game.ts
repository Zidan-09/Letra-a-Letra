import { RoomService } from "../services/roomService";
import { MovementsEnum } from "../utils/game/movementsEnum";
import { Themes } from "../utils/board/themesEnum";
import { GameModes } from "../utils/game/gameModes";
import { GameStatus } from "../utils/game/gameStatus";
import { NullPlayer, nullPlayer } from "../utils/game/nullPlayer";
import { LogEnum } from "../utils/server/logEnum";
import { createLog } from "../utils/server/logger";
import { Board } from "./board";
import { Player } from "./player";
import { CloseReasons } from "../utils/room/closeReasons";
import { TimeOut } from "../utils/room/timeOut";

export class Game {
  room_id: string;
  room_name: string;
  status: GameStatus;
  createdAt: number;
  timeout?: NodeJS.Timeout;
  players: Player[] = Array(2).fill(undefined);
  spectators: Player[] = Array(5).fill(undefined);
  bannedPlayerIds: string[] = [];
  bannedPlayers: Player[] = [];
  created_by: string;
  creator: string;
  timer: number;
  turn: number;
  board: Board | null;
  allowSpectators: boolean;
  privateRoom: boolean;

  constructor(
    room_id: string,
    room_name: string,
    status: GameStatus,
    player: Player,
    timer: number,
    allowSpectators: boolean,
    privateRoom: boolean
  ) {
    this.room_id = room_id;
    this.room_name = room_name;
    this.status = status;
    this.created_by = player.player_id;
    this.creator = player.nickname;
    this.timer = timer;
    this.turn = 0;
    this.board = null;
    this.allowSpectators = allowSpectators;
    this.privateRoom = privateRoom;
    this.players[0] = player;
    this.createdAt = Date.now();
    TimeOut.set(this);
  }

  toJSON() {
    return {
      room_id: this.room_id,
      room_name: this.room_name,
      status: this.status,
      createdAt: this.createdAt,
      players: this.players,
      spectators: this.spectators,
      bannedPlayerIds: this.bannedPlayerIds,
      bannedPlayers: this.bannedPlayers,
      created_by: this.created_by,
      creator: this.creator,
      timer: this.timer,
      turn: this.turn,
      board: this.board,
      allowSpectators: this.allowSpectators,
      privateRoom: this.privateRoom,
    };
  }

  public startGame(
    theme: Themes,
    gamemode: GameModes,
    allowedPowers: MovementsEnum[]
  ) {
    this.board = new Board(theme, gamemode, allowedPowers);
    this.turn = 0;
    this.status = GameStatus.GameRunning;
    TimeOut.remove(this);
  }

  public setStatus(status: GameStatus) {
    this.status = status;
  }

  public incrementTurn() {
    this.turn++;
  }

  gameOver(): Player | NullPlayer | false {
    const [p1, p2] = this.players;

    if (
      !this.board ||
      this.status === GameStatus.GameStarting ||
      this.status === GameStatus.GameOver
    )
      return false;

    if (!p1 && !p2) {
      const spectatorsExist = this.spectators.some((s) => s);

      this.status = GameStatus.GameOver;
      createLog(this.room_id, LogEnum.GAME_OVER);
      this.board = null;
      TimeOut.set(this);

      if (spectatorsExist) {
        return nullPlayer;
      }

      RoomService.closeRoom(this.room_id, CloseReasons.ALL_LEFT);
      return false;
    }

    if ((p1 && !p2) || (!p1 && p2)) {
      const winner = p1 || p2;
      this.status = GameStatus.GameOver;
      createLog(this.room_id, LogEnum.GAME_OVER);
      this.board = null;
      TimeOut.set(this);
      return winner!;
    }

    if (p1 && p2) {
      if (p1.score < 3 && p2.score < 3) return false;

      this.status = GameStatus.GameOver;
      createLog(this.room_id, LogEnum.GAME_OVER);
      this.board = null;

      TimeOut.set(this);

      return p1.score >= 3 ? p1 : p2;
    }

    return false;
  }
}
