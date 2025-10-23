import { Game } from "../../entities/game";
import { Player } from "../../entities/player";
import { CloseReasons } from "../room/closeReasons";
export declare const RoomSocket: {
    joinRoom(players: Player[], room: Game): void;
    leftRoom(players: Player[], room: Game): void;
    changeRole(players: Player[], room: Game): void;
    roomClosed(players: Player[], reason: CloseReasons): void;
    removePlayer(players: Player[], room: Game, banned: boolean, player_id: string): void;
};
//# sourceMappingURL=roomSocket.d.ts.map