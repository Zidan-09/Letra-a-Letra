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
            first: players.find(p => p.turn === 0)!,
            words: room.getBoard()?.getWords()!
        }

        players.forEach(p => 
            io.to(p.id).emit("game_started", data)
        );
    },

    letterRevealed(room_id: string, x:number, y: number, data: string | {letter: string, completedWord: string, player_score: number}, player_id: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (!room) return;
        const players = room?.getPlayers();
        if (!players) return;


        players.forEach(p => 
            io.to(p.id).emit("letter_revealed", {x: x, y:y, data: data, player_id: player_id})
        );
        
        this.gameOver(room_id);
    },

    gameOver(room_id: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (!room) return;
        const players = room.getPlayers();
        if (!players) return;
        const winner = room.gameOver();

        if (winner) {
            players.forEach(p =>
                io.to(p.id).emit("game_over", {winner: winner})
            )
        }
    },

    message() {

    }
}