import { Player } from "../entities/player";

export const PlayerServices = {
    createPlayer(idSocket: string, nickname: string): Player | undefined {
        const player: Player = {
            id: idSocket,
            nickname: nickname,
            turn: undefined,
            score: 0
        }

        return player;
    },

    getPlayer(id: string) {
        
    }
}