import { Game } from "../entities/game";
import { ServerResponses } from "../utils/responses/serverResponses";
import { RoomResponses } from "../utils/responses/roomResponses";
import { CloseReasons } from "../utils/room/closeReasons";
declare class RoomServices {
    private rooms;
    createRoom(room_name: string, allowSpectators: boolean, privateRoom: boolean, player_id: string): Game | ServerResponses.NOT_FOUND;
    joinRoom(room_id: string, player_id: string, spectator: boolean): {
        game: Game;
        actual: {
            letter: string;
            x: number;
            y: number;
            by: string;
        }[] | undefined;
    } | ServerResponses.NOT_FOUND;
    reconnectRoom(room_id: string, nickname: string, new_id: string): ServerResponses.RECONNECTED | ServerResponses.NOT_FOUND;
    leaveRoom(room_id: string, player_id: string): RoomResponses.LEFT_ROOM | RoomResponses.ROOM_CLOSED | ServerResponses.NOT_FOUND;
    afkPlayer(room_id: string, player_id: string): ServerResponses.ENDED | ServerResponses.NOT_FOUND;
    changeRole(room_id: string, player_id: string, role: "spectator" | "player", index: number): Game | ServerResponses.NOT_FOUND | RoomResponses.FULL_ROOM;
    getRoom(id: string): Game | ServerResponses.NOT_FOUND;
    getPublicRooms(): Game[];
    closeRoom(room_id: string, reason: CloseReasons): boolean;
    removePlayer(room_id: string, player_id: string, banned: boolean): ServerResponses.NOT_FOUND | Game;
    unbanPlayer(room_id: string, player_id: string): ServerResponses.NOT_FOUND | Game | RoomResponses.BANNED_PLAYER_NOT_FOUND;
}
export declare const RoomService: RoomServices;
export {};
//# sourceMappingURL=roomService.d.ts.map