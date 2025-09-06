import { RoomService } from "../../services/roomServices";
import { getSocketInstance } from "../../socket";
import { GameStarted } from "../emits/gameEmits";

export const SendSocket = {
    gameStarted(room_id: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        const players = room?.getPlayers();

        if (!room || !players) return;

        const data: GameStarted = {
            first: players.find(p => p.turn === 0)!
        }

        players.forEach(p => 
            io.to(p.id).emit("game_started", data)
        );
    },

    letterRevealed(room_id: string, x:number, y: number, letter: string | {letter: string, completedWord: string, player_id: string, player_score: number}) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        const players = room?.getPlayers();

        if (!room || !players) return;

        players.forEach(p => 
            io.to(p.id).emit("letter_revealed", {x: x, y:y, letter: letter})
        );
    },

    message() {

    }
}