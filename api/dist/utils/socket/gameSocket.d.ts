import { MoveEmit } from "./gameEmits";
import { MovementsEnum } from "../game/movementsEnum";
export declare const GameSocket: {
    gameStarted(room_id: string): void;
    movementOne(room_id: string, player_id: string, movement: MovementsEnum, data: MoveEmit): void;
    movementAll(room_id: string, player_id: string, movement: MovementsEnum, data: MoveEmit): void;
    passTurn(room_id: string): void;
    afkPlayer(player_id: string): void;
    gameOver(room_id: string): void;
    discardPower(room_id: string): void;
};
//# sourceMappingURL=gameSocket.d.ts.map