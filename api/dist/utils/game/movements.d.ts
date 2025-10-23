import { Board } from "../../entities/board";
import { Player } from "../../entities/player";
import { MoveEmit } from "../socket/gameEmits";
import { GameResponses } from "../responses/gameResponses";
import { MovementsEnum } from "./movementsEnum";
export declare const Movements: {
    clickCell(board: Board, x: number, y: number, player: Player, room_id: string): MoveEmit | GameResponses;
    blockCell(board: Board, x: number, y: number, player_id: string): MoveEmit | GameResponses;
    unblockCell(board: Board, x: number, y: number, player: Player, room_id: string): MoveEmit | GameResponses;
    trapCell(board: Board, x: number, y: number, player: Player, room_id: string, powerIdx: number): GameResponses | MoveEmit;
    detectTraps(board: Board, player_id: string): GameResponses | MoveEmit;
    effectMove(players: Player[], player_id: string, effect: MovementsEnum): MoveEmit | GameResponses;
    spy(board: Board, x: number, y: number, player_id: string): MoveEmit | GameResponses;
};
//# sourceMappingURL=movements.d.ts.map