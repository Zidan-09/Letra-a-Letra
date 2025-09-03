import { Player } from "../entities/player";
import { Players } from "../data";

export const PlayerServices = {
    createPlayer(namePlayer: string): Player | undefined {

        const lastId = Players[-1]?.id;
        let newId: string;

        if (lastId) {
            newId = 
        }

        const player: Player = {
            id: "",
            nickname: namePlayer
        }

        return player;
    },
}