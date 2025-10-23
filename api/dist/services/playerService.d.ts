import { Player } from "../entities/player";
import { ServerResponses } from "../utils/responses/serverResponses";
declare class PlayerServices {
    players: Map<string, Player>;
    createPlayer(socket_id: string, nickname: string, spectator: boolean, avatar: number): Player;
    getPlayer(player_id: string): Player | ServerResponses.NotFound;
    getAll(): Player[];
    savePlayer(player: Player): void;
    removePlayer(player_id: string): boolean;
}
export declare const PlayerService: PlayerServices;
export {};
//# sourceMappingURL=playerService.d.ts.map