import { MovementsEnum } from "../game/movementsEnum";
import { Themes } from "../board/themesEnum";
import { GameModes } from "../game/gameModes";

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

interface DiscardPower {
  player_id: string;
  power: MovementsEnum;
  powerIdx: number;
}

export { StartGame, PassTurn, Movement, DiscardPower };
