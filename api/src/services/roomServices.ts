import { Board } from "../entities/board";
import { Game } from "../entities/game";
import { Player } from "../entities/player";
import { ServerResponses } from "../utils/responses/serverResponses";
import { getSocketInstance } from "../socket";
import { RoomResponses } from "../utils/responses/roomResponses";
import { nanoid } from "nanoid";
import { GameStatus } from "../utils/game_utils/gameStatus";

class RoomServices {
    private rooms: Map<string, Game> = new Map();

    createRoom(player: Player) {
        const board: Board = new Board()

        const room: Game = new Game(nanoid(6), GameStatus.GameStarting, [player], board);

        this.rooms.set(room.room_id, room)

        return room;
    };

    joinRoom(id: string, player: Player) {
        const room = this.rooms.get(id);

        if (!room) return ServerResponses.NotFound;

        if (room.players.length >= 2) return RoomResponses.FullRoom;
        
        room.players.push(player);

        const io = getSocketInstance();

        room.players.forEach(p => {
            io.to(p.id).emit("player_joinned", room);
        })

        return room;
    }

    reconnectRoom(id: string, nickname: string, new_id: string) {
        const room = this.rooms.get(id);

        if (!room) return ServerResponses.NotFound;

        const desconnectedPlayer = room.players.find(p => p.nickname === nickname);

        if (desconnectedPlayer) {
            desconnectedPlayer.id = new_id;

            return ServerResponses.Reconnected;
        }
    }

    leaveRoom(id: string, player_id: string): ServerResponses.NotFound | RoomResponses.LeftRoom {
        const room = this.rooms.get(id);
        const player = room!.players.find(p =>
            p.id === player_id
        )
        if (!room || !player) return ServerResponses.NotFound;

        const index = room.players.indexOf(player);
        room.players.splice(index, 1);

        return RoomResponses.LeftRoom;
    }

    getRoom(id: string): Game | undefined {
        return this.rooms.get(id);
    }
}

export const RoomService = new RoomServices();