import { MovementsEnum } from "../board_utils/movementsEnum";
import { Themes } from "../board_utils/themesEnum";

interface StartGame {
    theme: Themes;
}

interface PassTurn {
    player_id: string;
}

interface Movement {
    player_id: string;
    movement: MovementsEnum;
    x: number;
    y: number;
}

export { StartGame, PassTurn, Movement }