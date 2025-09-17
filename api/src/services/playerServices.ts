import { Player } from "../entities/player";
import { RoomService } from "./roomServices";
import { ServerResponses } from "../utils/responses/serverResponses";

export const PlayerServices = {
    createPlayer(socket_id: string, nickname: string, spectator: boolean): Player | undefined {
        const player: Player = new Player(socket_id, nickname, spectator)

        return player;
    },

    getPlayer(room_id: string, player_id: string) {
        const room = RoomService.getRoom(room_id);
        if (!room) return ServerResponses.NotFound;

        const player = room.players.find(p => p.player_id === player_id);
        if (!player) return ServerResponses.NotFound;

        return player;
    },
}