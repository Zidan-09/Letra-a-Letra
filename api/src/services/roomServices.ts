import { Board } from "../entities/board";
import { Game } from "../entities/game";
import { Player } from "../entities/player";
import { v4 as uuidv4} from 'uuid';
import { ServerResponses } from "../utils/responses/serverResponses";
import { getSocketInstance } from "../socket";

class RoomServices {
    private rooms: Map<string, Game> = new Map();

    createRoom(player: Player) {
        const board: Board = new Board()

        const room: Game = {
            room_id: uuidv4(),
            players: [player],
            turn: 0,
            board: board
        };

        this.rooms.set(room.room_id, room)

        return room;
    };

    joinRoom(id: string, player: Player) {
        const room = this.rooms.get(id);

        if (!room) return ServerResponses.NotFound;

        room.players.push(player);

        const io = getSocketInstance();
        const existingPlayer = room.players.find(p => p.id !== player.id);

        if (existingPlayer) {
            io.to(existingPlayer.id).emit("player_joinned", room);
        }

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

    private getRoom(id: string): Game | undefined {
        return this.rooms.get(id);
    }
}

export const roomService = new RoomServices();