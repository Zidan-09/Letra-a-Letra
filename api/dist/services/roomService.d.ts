import { Game } from "../entities/game";
import { ServerResponses } from "../utils/responses/serverResponses";
import { RoomResponses } from "../utils/responses/roomResponses";
import { CloseReasons } from "../utils/room/closeReasons";
declare class RoomServices {
    private rooms;
    createRoom(room_name: string, timer: number, allowSpectators: boolean, privateRoom: boolean, player_id: string): Game | ServerResponses.NotFound;
    joinRoom(room_id: string, player_id: string, spectator: boolean): {
        game: Game;
        actual: {
            letter: string;
            x: number;
            y: number;
            by: string;
        }[] | undefined;
    } | ServerResponses.NotFound;
    reconnectRoom(room_id: string, nickname: string, new_id: string): ServerResponses.Reconnected | ServerResponses.NotFound;
    leaveRoom(room_id: string, player_id: string): RoomResponses.LeftRoom | RoomResponses.RoomClosed | ServerResponses.NotFound;
    afkPlayer(room_id: string, player_id: string): ServerResponses.Ended | ServerResponses.NotFound;
    changeRole(room_id: string, player_id: string, role: "spectator" | "player", index: number): Game | ServerResponses.NotFound | RoomResponses.FullRoom;
    getRoom(id: string): Game | ServerResponses.NotFound;
    getPublicRooms(): Game[];
    closeRoom(room_id: string, reason: CloseReasons): boolean;
    removePlayer(room_id: string, player_id: string, banned: boolean): ServerResponses.NotFound | Game;
    unbanPlayer(room_id: string, player_id: string): ServerResponses.NotFound | Game | RoomResponses.BannedPlayerNotFound;
}
export declare const RoomService: RoomServices;
export {};
//# sourceMappingURL=roomService.d.ts.map