import { Board } from "../entities/board";
import { Game } from "../entities/game";
import { Player } from "../entities/player";
import { v4 as uuidv4} from 'uuid';
import { ServerResponses } from "../utils/responses/serverResponses";

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

        console.log(room.room_id);

        this.rooms.set(room.room_id, room)

        return room;
    };

    joinRoom(id: string, player: Player) {
        if (this.rooms.get(id)) {
            return ServerResponses.NotFound
        }
        
        this.rooms.get(id)?.players.push(player);
    }

    getRoom(id: string): Game | undefined {
        return this.rooms.get(id);
    }
}

export const roomService = new RoomServices();