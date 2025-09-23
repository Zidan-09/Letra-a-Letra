import { Player } from "../entities/player";
import { ServerResponses } from "../utils/responses/serverResponses";

class PlayerServices {
    players: Map<string, Player> = new Map();

    createPlayer(socket_id: string, nickname: string, spectator: boolean): Player {
        const player: Player = new Player(socket_id, nickname, spectator)

        this.players.set(player.player_id, player);

        return player;
    };

    getPlayer(player_id: string): Player | ServerResponses.NotFound {
        const player = this.players.get(player_id);
        if (!player) return ServerResponses.NotFound;

        return player;
    };

    getAll(): Player[] {
        let players: Player[] = [];

        this.players.forEach(player => {
            players.push(player);
        })

        return players;
    }

    removePlayer(player_id: string): boolean {
        const result = this.players.delete(player_id);

        return result;
    }
}

export const PlayerService = new PlayerServices();