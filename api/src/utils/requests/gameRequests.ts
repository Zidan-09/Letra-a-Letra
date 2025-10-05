import { MovementsEnum } from "../board_utils/movementsEnum";
import { Themes } from "../board_utils/themesEnum";
import { GameModes } from "../game_utils/gameModes";

interface StartGame {
    theme: Themes;
    gamemode: GameModes;
    allowedPowers: MovementsEnum[];
}

interface PassTurn {
    player_id: string;
}

interface Movement {
    player_id: string;
    movement: MovementsEnum;
    powerIndex?: number;
    x: number;
    y: number;
}

export { StartGame, PassTurn, Movement }