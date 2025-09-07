import { Game } from "../entities/game";
import { Player } from "../entities/player";
import { ServerResponses } from "../utils/responses/serverResponses";
import { getSocketInstance } from "../socket";
import { RoomResponses } from "../utils/responses/roomResponses";
import { nanoid } from "nanoid";
import { GameStatus } from "../utils/game_utils/gameStatus";

class RoomServices {
    private rooms: Map<string, Game> = new Map();

    public createRoom(player: Player) {
        const room: Game = new Game(nanoid(6), GameStatus.GameStarting, [player]);

        this.rooms.set(room.getRoomId(), room)

        return room;
    };

    public joinRoom(id: string, player: Player) {
        const room = this.rooms.get(id);
        if (!room) return ServerResponses.NotFound;
        const players = room?.getPlayers();
        if (!players) return ServerResponses.NotFound;

        if (players.length >= 2) return RoomResponses.FullRoom;
        
        players.push(player);

        const io = getSocketInstance();

        players.forEach(p => {
            io.to(p.id).emit("player_joinned", room);
        })

        return room;
    }

    public reconnectRoom(id: string, nickname: string, new_id: string) {
        const room = this.rooms.get(id);

        if (!room) return ServerResponses.NotFound;

        const desconnectedPlayer = room.getPlayers().find(p => p.nickname === nickname);

        if (desconnectedPlayer) {
            desconnectedPlayer.id = new_id;

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

        if (players.length === 0) {
            this.closeRoom(room_id);
        }

        return RoomResponses.LeftRoom;
    }

    public getRoom(id: string): Game | undefined {
        return this.rooms.get(id);
    }

    protected closeRoom(room_id: string) {
        return this.rooms.delete(room_id);
    }
}

export const RoomService = new RoomServices();