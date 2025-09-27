import { MovementsEnum } from "../board_utils/movementsEnum";
import { GameModes } from "../game_utils/gameModes";

interface CreateRoom {
    room_name: string;
    timer: number;
    allowSpectators: boolean;
    privateRoom: boolean;
    player_id: string;
}

interface RoomParams {
    room_id: string;
}

interface ActionParams {
    room_id: string;
    player_id: string;
}

interface JoinRoom {
    spectator: boolean;
    player_id: string;
}

interface LeaveRoom {
    room_id: string;
    player_id: string;
}

interface ChangeRole {
    role: "player" | "spectator"
}

interface ChangeRoomSettigns {
    turn_time: number;
    allowedPowers: MovementsEnum[];
    gameMode: GameModes;
}

export { CreateRoom, RoomParams, ActionParams, JoinRoom, LeaveRoom, ChangeRole, ChangeRoomSettigns }