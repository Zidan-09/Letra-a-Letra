import { RoomService } from "../../services/roomService";
import { ServerResponses } from "../responses/serverResponses";
import { getSocketInstance } from "../../socket";

export function sendMessage(room_id: string, from: string, message: string) {
    const io = getSocketInstance();

    const room = RoomService.getRoom(room_id);

    if (room === ServerResponses.NotFound) return;

    const all = [...room.players, ...room.spectators];

    if (!all) return;

    all.filter(Boolean).forEach(p => 
        io.to(p.player_id).emit("message", { from: from, message: message })
    );
}