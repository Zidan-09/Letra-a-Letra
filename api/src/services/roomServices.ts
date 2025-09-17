import { Game } from "../entities/game";
import { Player } from "../entities/player";
import { ServerResponses } from "../utils/responses/serverResponses";
import { getSocketInstance } from "../socket";
import { RoomResponses } from "../utils/responses/roomResponses";
import { nanoid } from "nanoid";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { createLog } from "../utils/server_utils/logs";
import { LogEnum } from "../utils/server_utils/logEnum";
import { SendSocket } from "../utils/game_utils/sendSocket";

class RoomServices {
    private rooms: Map<string, Game> = new Map();

    public createRoom(player: Player, privateRoom: boolean) {
        const room: Game = new Game(nanoid(6), GameStatus.GameStarting, [player], privateRoom);
        createLog(room.room_id, LogEnum.RoomCreated);
        createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerJoined}`);

        this.rooms.set(room.room_id, room);

        return room;
    };

    public joinRoom(room_id: string, player: Player) {
        const room = this.rooms.get(room_id)!;
        const players = room.players;
        
        players.push(player);
        createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerJoined}`);

        const io = getSocketInstance();

        players.forEach(p => {
            io.to(p.player_id).emit("player_joinned", room);
        })

        return room;
    }

    public joinAsSpectator(room_id: string, player: Player) {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        room.spectators.push(player);
        createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerJoinedAsSpectator}`);

        const io = getSocketInstance();

        room.players.forEach(p => {
            io.to(p.player_id).emit("player_joined_as_spectator", room);
        })

        return room;
    }

    public reconnectRoom(room_id: string, nickname: string, new_id: string) {
        const room = this.rooms.get(room_id);

        if (!room) return ServerResponses.NotFound;

        const desconnectedPlayer = room.players.find(p => p.nickname === nickname);

        if (desconnectedPlayer) {
            desconnectedPlayer.player_id = new_id;
            createLog(room_id, `${nickname} ${LogEnum.PlayerReconnected}`);

            return ServerResponses.Reconnected;
        }
    }

    public leaveRoom(room_id: string, player_id: string): ServerResponses.NotFound | RoomResponses.LeftRoom {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;
        const players = room!.players;
        if (!players) return ServerResponses.NotFound;
        const player = players.find(p =>
            p.player_id === player_id
        )
        if (!player) return ServerResponses.NotFound;

        const index = players.indexOf(player);
        players.splice(index, 1);
        createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerLeft}`);

        if (players.length === 0) {
            this.closeRoom(room_id);
            createLog(room_id, LogEnum.RoomClosed);
        }

        const io = getSocketInstance();

        players.forEach(p => {
            io.to(p.player_id).emit("player_left", room);
        })

        return RoomResponses.LeftRoom;
    }

    public getRoom(id: string): Game | undefined {
        return this.rooms.get(id);
    }

    public getPublicRooms() {
        const publicRooms: Game[] = [];

        this.rooms.forEach(room => {
            if (!room.privateRoom) {
                publicRooms.push(room);
            }
        })

        return publicRooms;
    }

    protected closeRoom(room_id: string) {
        return this.rooms.delete(room_id);
    }

    public afkPlayer(room_id: string, player_id: string) {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;
        const players = room.players;

        const player = players.find(p => p.player_id === player_id);
        if (!player) return ServerResponses.NotFound;

        players.splice(players.indexOf(player), 1);

        SendSocket.gameOver(room_id);
        return ServerResponses.Ended;
    }

    public turnPlayerToSpectator(room_id: string, player: Player) {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const playerIndex = room.players.indexOf(player);
        if (playerIndex === -1) return ServerResponses.NotFound;

        room.players.splice(playerIndex, 1);
        player.spectator = true;
        room.spectators.push(player);
        createLog(room.room_id, `${player.nickname} ${LogEnum.PlayerTurnedToSpectator}`);

        const io = getSocketInstance();
        io.to(player.player_id).emit("player_turned_to_spectator", room);
        return room;
    }

    public turnSpectatorToPlayer(room_id: string, player: Player) {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;

        const spectatorIndex = room.spectators.indexOf(player);
        if (spectatorIndex === -1) return ServerResponses.NotFound;

        room.spectators.splice(spectatorIndex, 1);
        player.spectator = false;
        room.players.push(player);
        createLog(room.room_id, `${player.nickname} ${LogEnum.SpectatorTurnedToPlayer}`);

        const io = getSocketInstance();
        io.to(player.player_id).emit("spectator_turned_to_player", room);

        return room;
    }
}

export const RoomService = new RoomServices();