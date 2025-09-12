import { MovementsEnum } from "../board_utils/movementsEnum";

interface StartGame {
    room_id: string;
}

interface PassTurn {
    room_id: string;
    player_id: string;
}

interface Movement {
    room_id: string;
    player_id: string;
    movement: MovementsEnum;
    x: number;
    y: number;
}

export { StartGame, PassTurn, Movement }