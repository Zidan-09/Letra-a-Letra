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

    public createRoom(player: Player) {
        const room: Game = new Game(nanoid(6), GameStatus.GameStarting, [player]);
        createLog(room.getRoomId(), LogEnum.RoomCreated);
        createLog(room.getRoomId(), `${player.nickname} ${LogEnum.PlayerJoinned}`);

        this.rooms.set(room.getRoomId(), room);

        return room;
    };

    public joinRoom(room_id: string, player: Player) {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;
        const players = room?.getPlayers();
        if (!players) return ServerResponses.NotFound;

        if (players.length >= 2) return RoomResponses.FullRoom;
        
        players.push(player);
        createLog(room.getRoomId(), `${player.nickname} ${LogEnum.PlayerJoinned}`);

        const io = getSocketInstance();

        players.forEach(p => {
            io.to(p.id).emit("player_joinned", room);
        })

        return room;
    }

    public reconnectRoom(room_id: string, nickname: string, new_id: string) {
        const room = this.rooms.get(room_id);

        if (!room) return ServerResponses.NotFound;

        const desconnectedPlayer = room.getPlayers().find(p => p.nickname === nickname);

        if (desconnectedPlayer) {
            desconnectedPlayer.id = new_id;
            createLog(room_id, `${nickname} ${LogEnum.PlayerReconnected}`);

            return ServerResponses.Reconnected;
        }
    }

    public leaveRoom(room_id: string, player_id: string): ServerResponses.NotFound | RoomResponses.LeftRoom {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;
        const players = room!.getPlayers();
        if (!players) return ServerResponses.NotFound;
        const player = players.find(p =>
            p.id === player_id
        )
        if (!player) return ServerResponses.NotFound;

        const index = players.indexOf(player);
        players.splice(index, 1);
        createLog(room.getRoomId(), `${player.nickname} ${LogEnum.PlayerLeft}`);

        if (players.length === 0) {
            this.closeRoom(room_id);
            createLog(room_id, LogEnum.RoomClosed);
        }

        const io = getSocketInstance();

        players.forEach(p => {
            io.to(p.id).emit("player_left", room);
        })

        return RoomResponses.LeftRoom;
    }

    public getRoom(id: string): Game | undefined {
        return this.rooms.get(id);
    }

    protected closeRoom(room_id: string) {
        return this.rooms.delete(room_id);
    }

    public afkPlayer(room_id: string, player_id: string) {
        const room = this.rooms.get(room_id);
        if (!room) return ServerResponses.NotFound;
        const players = room.getPlayers();

        const player = players.find(p => p.id === player_id);
        if (!player) return ServerResponses.NotFound;

        players.slice(players.indexOf(player), 1);

        SendSocket.gameOver(room_id);
    }
}

export const RoomService = new RoomServices();