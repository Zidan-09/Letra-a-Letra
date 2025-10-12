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

class RoomServices {
    private rooms: Map<string, Game> = new Map();

    public createRoom(
        room_name: string,
        timer: number,
        allowSpectators: boolean, 
        privateRoom: boolean, 
        player_id: string
    ): Game | ServerResponses.NotFound {
        const player = PlayerService.getPlayer(player_id);
        if (player === ServerResponses.NotFound) return ServerResponses.NotFound;

        const room: Game = new Game(
            nanoid(6),
            room_name,
            GameStatus.GameStarting,
            player,
            timer,
            allowSpectators,
            privateRoom
        );

        createLog(room.room_id, LogEnum.RoomCreated);
        createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerJoined}`);

        this.rooms.set(room.room_id, room);
        PlayerService.removePlayer(player_id);

        return room;
    }

    public joinRoom(
        room_id: string,
        player_id: string,
        spectator: boolean
    ): Game | ServerResponses.NotFound {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const player = PlayerService.getPlayer(player_id);
        if (player === ServerResponses.NotFound) return ServerResponses.NotFound;

        if (spectator) {
            const index = room.spectators.findIndex(s => !s);
            room.spectators[index] = player;
            player.spectator = true;
            createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerJoinedAsSpectator}`);
        } else {
            const index = room.players.findIndex(p => !p);
            room.players[index] = player;
            createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerJoined}`);
        }

        const sameNickname = [...room.players, ...room.spectators].filter(Boolean).find(p => p.nickname === player.nickname);

        if (sameNickname) enumNicknames([...room.players, ...room.spectators]);

        RoomSocket.joinRoom([...room.players, ...room.spectators], room);

        return room;
    }

    public reconnectRoom(
        room_id: string,
        nickname: string,
        new_id: string
    ): ServerResponses.Reconnected | ServerResponses.NotFound {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const disconnectedPlayer = room.players.filter(Boolean).find(p => p?.nickname === nickname);
        if (!disconnectedPlayer) return ServerResponses.NotFound;

        disconnectedPlayer.player_id = new_id;
        createLog(room_id, `${nickname} ${LogEnum.PlayerReconnected}`);

        return ServerResponses.Reconnected;
    }

    public leaveRoom(
        room_id: string,
        player_id: string
    ): RoomResponses.LeftRoom | RoomResponses.RoomClosed | ServerResponses.NotFound {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const player =
            room.players.filter(Boolean).find(p => p.player_id === player_id) ||
            room.spectators.filter(Boolean).find(s => s.player_id === player_id);

        if (!player) return ServerResponses.NotFound;

        if (player.spectator) {
            const index = room.spectators.findIndex(p => p?.player_id === player_id);
            if (index !== -1) room.spectators[index] = undefined as any;
            
        } else {
            const index = room.players.findIndex(p => p?.player_id === player_id);
            if (index !== -1) room.players[index] = undefined as any;
        }

        enumNicknames([...room.players, ...room.spectators]);

        if (room.created_by === player.player_id) {
        
            const allRemaining = [...room.players, ...room.spectators].filter(Boolean);
            
            const newLeader = allRemaining[0]; 

            if (newLeader) {
                room.created_by = newLeader.player_id;
                room.creator = newLeader.nickname;
            }
        }

        createLog(room_id, `${player.nickname} ${LogEnum.PlayerLeft}`);

        const all = [...room.players, ...room.spectators];
        if (!all.some(Boolean)) {
            this.rooms.delete(room_id);
            return RoomResponses.RoomClosed;
        }

        RoomSocket.leftRoom(all, room);

        try {
            GameSocket.gameOver(room_id);
        } catch (err) {
            console.warn(`gameOver failed for room ${room_id}:`, err);
        }

        return RoomResponses.LeftRoom;
    }

    public afkPlayer(room_id: string, player_id: string): ServerResponses.Ended | ServerResponses.NotFound {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const playerIndex = room.players.findIndex(p => p?.player_id === player_id);
        if (playerIndex === -1) return ServerResponses.NotFound;

        room.players[playerIndex] = undefined as any;
        GameSocket.gameOver(room_id);

        return ServerResponses.Ended;
    }

    public changeRole(
        room_id: string,
        player_id: string,
        role: "spectator" | "player",
        index: number
    ): Game | ServerResponses.NotFound | RoomResponses.FullRoom {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const spectator = role === "spectator";

        const player = room.players.filter(Boolean).find(p => p.player_id === player_id) || 
        room.spectators.filter(Boolean).find(s => s.player_id === player_id);
        
        if (!player) return ServerResponses.NotFound;

        const currentArray = player.spectator ? room.spectators : room.players;
        const otherArray = player.spectator ? room.players : room.spectators;
        const playerIndex = currentArray.findIndex(p => p?.player_id === player_id);

        if (player.spectator === spectator) {
            if (currentArray[index]) return RoomResponses.FullRoom;
            currentArray[playerIndex] = undefined as any;
            currentArray[index] = player;

            createLog(room.room_id, `${player.nickname} ${LogEnum.SwapSlot}`);

        } else {
            if (otherArray[index]) return RoomResponses.FullRoom;
            currentArray[playerIndex] = undefined as any;
            player.spectator = spectator;
            otherArray[index] = player;

            createLog(room.room_id, `${player.nickname} ${spectator ? LogEnum.PlayerTurnedToSpectator : LogEnum.SpectatorTurnedToPlayer}`);
        }

        RoomSocket.changeRole([...room.players, ...room.spectators], room);

        return room;
    }

    public getRoom(id: string): Game | ServerResponses.NotFound {
        return this.rooms.get(id) ?? ServerResponses.NotFound;
    }

    public getPublicRooms(): Game[] {
        return Array.from(this.rooms.values()).filter(room => !room.privateRoom);
    }

    public closeRoom(room_id: string): boolean {
        return this.rooms.delete(room_id);
    }
}

export const RoomService = new RoomServices();