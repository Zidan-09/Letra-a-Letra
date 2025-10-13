import { Game } from "../../entities/game";
import { GameStatus } from "../game/gameStatus";
import { RoomService } from "../../services/roomService";
import { ServerResponses } from "../responses/serverResponses";
import { CloseReasons } from "./closeReasons";

export function roomTimeOut(room: Game) {
    room.timeout = setTimeout(() => {
        const existingRoom = RoomService.getRoom(room.room_id);

        if (existingRoom === ServerResponses.NotFound) return;

        if (existingRoom.status !== GameStatus.GameRunning) RoomService.closeRoom(existingRoom.room_id, CloseReasons.TIMEOUT);

    }, 5 * 60 * 1000);
};