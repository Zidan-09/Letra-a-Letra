import { MovementsEnum } from "../board_utils/movementsEnum";
import { Themes } from "../board_utils/themesEnum";

interface StartGame {
    room_id: string;
    theme: Themes;
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