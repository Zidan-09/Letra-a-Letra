import { Player } from "../entities/player";

export const PlayerServices = {
    createPlayer(socket_id: string, nickname: string): Player | undefined {
        const player: Player = new Player(socket_id, nickname)

        return player;
    },

    getPlayer(player_id: string) {
        return new Player(player_id, "Bananilson")
    },
}