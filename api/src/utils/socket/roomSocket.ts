import { getSocketInstance } from "../../socket";
import { Game } from "../../entities/game";
import { Player } from "../../entities/player";

export const RoomSocket = {
    joinRoom(players: Player[], room: Game) {
        const io = getSocketInstance();

        players.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit("player_joined", room)
        );
    },

    leftRoom(players: Player[], room: Game) {
        const io = getSocketInstance();

        players.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit("player_left", room)
        );
    },

    changeRole(players: Player[], room: Game) {
        const io = getSocketInstance();

        players.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit("role_changed", room)
        );
    }
}