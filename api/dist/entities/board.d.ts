import { Cell } from "./cell";
import { Themes } from "../utils/board/themesEnum";
import { MovementsEnum } from "../utils/game/movementsEnum";
import { GameModes } from "../utils/game/gameModes";
export declare class Board {
    range: number;
    words: string[];
    finded: number;
    findedWords: string[];
    grid: Cell[][];
    wordPositions: {
        [word: string]: [number, number][];
    };
    constructor(theme: Themes, gamemode: GameModes, allowedPowers: MovementsEnum[]);
    createBoard(words: string[], gamemode: GameModes, allowedPowers: MovementsEnum[]): Cell[][];
}
//# sourceMappingURL=board.d.ts.map