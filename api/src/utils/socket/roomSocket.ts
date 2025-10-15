import { getSocketInstance } from "../../socket";
import { Game } from "../../entities/game";
import { Player } from "../../entities/player";
import { CloseReasons } from "../room/closeReasons";

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
    },

    roomClosed(players: Player[], reason: CloseReasons) {
        const io = getSocketInstance();

        players.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit("room_closed", reason)
        );
    },

    removePlayer(players: Player[], room: Game, banned: boolean, player_id: string) {
        const io = getSocketInstance();

        const event = banned ? "banned" : "kicked"

        players.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit(event, {room: room, player: player_id})
        );
    }
}