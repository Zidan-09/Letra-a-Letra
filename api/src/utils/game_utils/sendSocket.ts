import { RoomService } from "../../services/roomServices";
import { getSocketInstance } from "../../socket";
import { GameStarted } from "../emits/gameEmits";

export const SendSocket = {
    gameStarted(room_id: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (!room) return;

        const data: GameStarted = {
            first: room.players.find(p => p.turn === 0)!
        }

        room.players.forEach(p => 
            io.to(p.id).emit("game_started", data)
        );
    },

    letterRevealed(room_id: string, x:number, y: number, letter: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (!room) return;

        room.players.forEach(p => 
            io.to(p.id).emit("letter_revealed", {x: x, y:y, letter: letter})
        );
    },

    message() {

    }
}