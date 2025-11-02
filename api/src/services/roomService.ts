import { Game } from "../entities/game";
import { ServerResponses } from "../utils/responses/serverResponses";
import { RoomResponses } from "../utils/responses/roomResponses";
import { nanoid } from "nanoid";
import { GameStatus } from "../utils/game/gameStatus";
import { createLog } from "../utils/server/logger";
import { LogEnum } from "../utils/server/logEnum";
import { GameSocket } from "../utils/socket/gameSocket";
import { RoomSocket } from "../utils/socket/roomSocket";
import { PlayerService } from "./playerService";
import { enumNicknames } from "../utils/room/enumNicknames";
import { CloseReasons } from "../utils/room/closeReasons";
import { Ban } from "../utils/player/ban";
import { getRevealeds } from "../utils/board/getRevealeds";

class RoomServices {
  private rooms: Map<string, Game> = new Map();

  public createRoom(
    room_name: string,
    timer: number,
    allowSpectators: boolean,
    privateRoom: boolean,
    player_id: string
  ): Game | ServerResponses.NOT_FOUND {
    const player = PlayerService.getPlayer(player_id);
    if (player === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    const room: Game = new Game(
      nanoid(6),
      room_name,
      GameStatus.GameStarting,
      player,
      timer,
      allowSpectators,
      privateRoom
    );

    createLog(room.room_id, LogEnum.ROOM_CREATED);
    createLog(room.room_id, `${player.nickname} ${LogEnum.PLAYER_JOINED}`);

    this.rooms.set(room.room_id, room);
    PlayerService.removePlayer(player_id);

    return room;
  }

  public joinRoom(
    room_id: string,
    player_id: string,
    spectator: boolean
  ):
    | {
        game: Game;
        actual:
          | { letter: string; x: number; y: number; by: string }[]
          | undefined;
      }
    | ServerResponses.NOT_FOUND {
    const room = this.rooms.get(room_id);
    if (!room) return ServerResponses.NOT_FOUND;

    const player = PlayerService.getPlayer(player_id);
    if (player === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    if (spectator) {
      const index = room.spectators.findIndex((s) => !s);
      room.spectators[index] = player;
      player.spectator = true;
      createLog(
        room.room_id,
        `${player.nickname} ${LogEnum.PLAYER_JOINED_AS_SPECTATOR}`
      );
    } else {
      const index = room.players.findIndex((p) => !p);
      room.players[index] = player;
      createLog(room.room_id, `${player.nickname} ${LogEnum.PLAYER_JOINED}`);
    }

    const sameNickname = [...room.players, ...room.spectators]
      .filter(Boolean)
      .find((p) => p.nickname === player.nickname);

    if (sameNickname) enumNicknames([...room.players, ...room.spectators]);

    RoomSocket.joinRoom([...room.players, ...room.spectators], room);

    return {
      game: room,
      actual: getRevealeds(room.board) ?? [],
    };
  }

  public reconnectRoom(
    room_id: string,
    nickname: string,
    new_id: string
  ): ServerResponses.RECONNECTED | ServerResponses.NOT_FOUND {
    const room = this.rooms.get(room_id);
    if (!room) return ServerResponses.NOT_FOUND;

    const disconnectedPlayer = room.players
      .filter(Boolean)
      .find((p) => p?.nickname === nickname);
    if (!disconnectedPlayer) return ServerResponses.NOT_FOUND;

    disconnectedPlayer.player_id = new_id;
    createLog(room_id, `${nickname} ${LogEnum.PLAYER_RECONNECTED}`);

    return ServerResponses.RECONNECTED;
  }

  public leaveRoom(
    room_id: string,
    player_id: string
  ):
    | RoomResponses.LEFT_ROOM
    | RoomResponses.ROOM_CLOSED
    | ServerResponses.NOT_FOUND {
    const room = this.rooms.get(room_id);
    if (!room) return ServerResponses.NOT_FOUND;

    const player =
      room.players.filter(Boolean).find((p) => p.player_id === player_id) ||
      room.spectators.filter(Boolean).find((s) => s.player_id === player_id);

    if (!player) return ServerResponses.NOT_FOUND;

    if (player.spectator) {
      const index = room.spectators.findIndex(
        (p) => p?.player_id === player_id
      );
      if (index !== -1) room.spectators[index] = undefined as any;
    } else {
      const index = room.players.findIndex((p) => p?.player_id === player_id);
      if (index !== -1) room.players[index] = undefined as any;

      if (room.status === GameStatus.GameRunning) player.leaved++;
      if (player.leaved >= 3) Ban.setPlayerTimeout(player);
    }

    enumNicknames([...room.players, ...room.spectators]);

    if (room.created_by === player.player_id) {
      const allRemaining = [...room.players, ...room.spectators].filter(
        Boolean
      );

      const newLeader = allRemaining[0];

      if (newLeader) {
        room.created_by = newLeader.player_id;
        room.creator = newLeader.nickname;
      }
    }

    createLog(room_id, `${player.nickname} ${LogEnum.PLAYER_LEFT}`);
    PlayerService.savePlayer(player);

    const all = [...room.players, ...room.spectators];
    if (!all.some(Boolean)) {
      this.rooms.delete(room_id);
      return RoomResponses.ROOM_CLOSED;
    }

    RoomSocket.leftRoom(all, room);

    try {
      GameSocket.gameOver(room_id);
    } catch (err) {
      console.warn(`gameOver failed for room ${room_id}:`, err);
    }

    return RoomResponses.LEFT_ROOM;
  }

  public afkPlayer(
    room_id: string,
    player_id: string
  ): ServerResponses.ENDED | ServerResponses.NOT_FOUND {
    const room = this.rooms.get(room_id);
    if (!room) return ServerResponses.NOT_FOUND;

    const playerIndex = room.players.findIndex(
      (p) => p?.player_id === player_id
    );
    if (playerIndex === -1) return ServerResponses.NOT_FOUND;

    const player = room.players[playerIndex];
    if (player) {
      player.passed = 0;
      PlayerService.savePlayer(player);
    }

    room.players[playerIndex] = undefined as any;

    GameSocket.gameOver(room_id);
    GameSocket.afkPlayer(player_id);

    return ServerResponses.ENDED;
  }

  public changeRole(
    room_id: string,
    player_id: string,
    role: "spectator" | "player",
    index: number
  ): Game | ServerResponses.NOT_FOUND | RoomResponses.FULL_ROOM {
    const room = this.rooms.get(room_id);
    if (!room) return ServerResponses.NOT_FOUND;

    const spectator = role === "spectator";

    const player =
      room.players.filter(Boolean).find((p) => p.player_id === player_id) ||
      room.spectators.filter(Boolean).find((s) => s.player_id === player_id);

    if (!player) return ServerResponses.NOT_FOUND;

    const currentArray = player.spectator ? room.spectators : room.players;
    const otherArray = player.spectator ? room.players : room.spectators;
    const playerIndex = currentArray.findIndex(
      (p) => p?.player_id === player_id
    );

    if (player.spectator === spectator) {
      if (currentArray[index]) return RoomResponses.FULL_ROOM;
      currentArray[playerIndex] = undefined as any;
      currentArray[index] = player;

      createLog(room.room_id, `${player.nickname} ${LogEnum.SWAP_SLOT}`);
    } else {
      if (otherArray[index]) return RoomResponses.FULL_ROOM;
      currentArray[playerIndex] = undefined as any;
      player.spectator = spectator;
      otherArray[index] = player;

      createLog(
        room.room_id,
        `${player.nickname} ${
          spectator
            ? LogEnum.PLAYER_JOINED_AS_SPECTATOR
            : LogEnum.SPECTATOR_TURNED_TO_PLAYER
        }`
      );
    }

    RoomSocket.changeRole([...room.players, ...room.spectators], room);

    return room;
  }

  public getRoom(id: string): Game | ServerResponses.NOT_FOUND {
    return this.rooms.get(id) ?? ServerResponses.NOT_FOUND;
  }

  public getPublicRooms(): Game[] {
    return Array.from(this.rooms.values()).filter((room) => !room.privateRoom);
  }

  public closeRoom(room_id: string, reason: CloseReasons): boolean {
    const room = this.rooms.get(room_id);

    if (!room) return false;

    clearTimeout(room.timeout);

    RoomSocket.roomClosed([...room.players, ...room.spectators], reason);
    createLog(room_id, `${LogEnum.ROOM_CLOSED} because ${reason}`);

    return this.rooms.delete(room_id);
  }

  public removePlayer(room_id: string, player_id: string, banned: boolean) {
    const room = this.rooms.get(room_id);

    if (!room) return ServerResponses.NOT_FOUND;

    const all = [...room.players, ...room.spectators];

    const player = all.filter(Boolean).find((p) => p.player_id === player_id);

    if (!player) return ServerResponses.NOT_FOUND;

    const idx = all.filter(Boolean).findIndex((p) => p === player);
    room.players[idx] = undefined as any;

    if (banned) {
      room.bannedPlayerIds.push(player_id);
      room.bannedPlayers.push(player);
    }

    PlayerService.savePlayer(player);

    createLog(
      room_id,
      `${player.nickname} ${
        banned ? LogEnum.PLAYER_BANNED : LogEnum.PLAYER_KICKED
      }`
    );

    RoomSocket.removePlayer(all, room, banned, player_id);

    return room;
  }

  public unbanPlayer(room_id: string, player_id: string) {
    const room = this.rooms.get(room_id);

    if (!room) return ServerResponses.NOT_FOUND;

    if (!room.bannedPlayerIds.includes(player_id))
      return RoomResponses.BANNED_PLAYER_NOT_FOUND;

    const idx = room.bannedPlayerIds.findIndex((id) => id === player_id);
    const pid = room.bannedPlayers.findIndex((p) => p.player_id === player_id);

    if (idx === undefined || pid === undefined)
      return RoomResponses.BANNED_PLAYER_NOT_FOUND;

    room.bannedPlayerIds.splice(idx, 1);
    room.bannedPlayers.splice(pid, 1);

    createLog(
      room_id,
      `player with id: ${player_id} ${LogEnum.PLAYER_UNBANNED}`
    );

    return room;
  }
}

export const RoomService = new RoomServices();
