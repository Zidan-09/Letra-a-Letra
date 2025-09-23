import { MovementsEnum } from "../board_utils/movementsEnum";
import { GameModes } from "../game_utils/gameModes";

interface CreateRoom {
    room_name: string;
    allowedPowers: MovementsEnum[];
    gameMode: GameModes;
    spectators: boolean;
    privateRoom: boolean;
    player_id: string;
}

interface JoinRoom {
    room_id: string;
    spectator: boolean;
    player_id: string;
}

interface LeaveRoom {
    room_id: string;
    player_id: string;
}

interface TurnSpectator {
    room_id: string;
    player_id: string;
}

interface TurnPlayer {
    room_id: string;
    player_id: string;
}

interface ChangeRoomSettigns {
    room_id: string;
    allowedPowers: MovementsEnum[];
    gameMode: GameModes;
}

export { CreateRoom, JoinRoom, LeaveRoom, TurnSpectator, TurnPlayer, ChangeRoomSettigns }