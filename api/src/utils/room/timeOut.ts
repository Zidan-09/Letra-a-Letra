import { Game } from "../../entities/game";
import { GameStatus } from "../game/gameStatus";
import { RoomService } from "../../services/roomService";
import { ServerResponses } from "../responses/serverResponses";
import { CloseReasons } from "./closeReasons";

export const TimeOut = {
  set(room: Game) {
    this.remove(room);

    room.timeout = setTimeout(() => {
      const existingRoom = RoomService.getRoom(room.room_id);

      if (existingRoom === ServerResponses.NOT_FOUND) return;

      if (existingRoom.status !== GameStatus.GameRunning)
        RoomService.closeRoom(existingRoom.room_id, CloseReasons.TIMEOUT);
    }, 5 * 60 * 1000);
  },

  remove(room: Game) {
    if (room.timeout) clearTimeout(room.timeout);
  },
};
