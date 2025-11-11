import { selectTheme } from "../utils/board/selectTheme";
import { placeWord } from "../utils/board/placeWord";
import { canPlaceWord } from "../utils/board/canPlaceWord";
import { Cell } from "./cell";
import { Themes } from "../utils/board/themesEnum";
import { MovementsEnum } from "../utils/game/movementsEnum";
import settings from "../settings/board.json";
import { GameModes } from "../utils/game/gameModes";

export class Board {
  range: number = settings.range;
  words: string[];
  finded: number = 0;
  findedWords: string[] = [];
  grid: Cell[][];
  wordPositions: { [word: string]: [number, number][] } = {};

  constructor(
    theme: Themes,
    gamemode: GameModes,
    allowedPowers: MovementsEnum[]
  ) {
    this.words = selectTheme(theme);
    this.grid = this.createBoard(
      this.words,
      gamemode,
      allowedPowers
    );
  }

  createBoard(
    words: string[],
    gamemode: GameModes,
    allowedPowers: MovementsEnum[]
  ): Cell[][] {
    const grid: Cell[][] = Array.from({ length: this.range + 1 }, (_, x) =>
      Array.from(
        { length: this.range + 1 },
        (_, y) => new Cell("", x, y, gamemode, allowedPowers)
      )
    );

    const directions = {
      [GameModes.EASY]: [
        [0, 1],
        [1, 0],
      ],
      [GameModes.NORMAL]: [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ],
      [GameModes.HARD]: [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 0],
        [0, -1],
        [1, -1],
      ],
      [GameModes.INSANE]: [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 0],
        [0, -1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ],
      [GameModes.CATACLISM]: [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 0],
        [0, -1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ]
    };

    words.forEach((word) => {
      let placed = false;
      let attemps = 0;

      while (!placed && attemps < 500) {
        attemps++;

        const row = Math.floor(Math.random() * (this.range + 1));
        const column = Math.floor(Math.random() * (this.range + 1));

        const dirSet = directions[gamemode];
        const [dx, dy] = dirSet[Math.floor(Math.random() * dirSet.length)]!;

        if (canPlaceWord(word, row, column, dx!, dy!, grid)) {
          placeWord(word, row, column, dx!, dy!, grid, this.wordPositions);
          placed = true;
        }
      }
    });

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i <= this.range; i++) {
      for (let j = 0; j <= this.range; j++) {
        if (grid[i]![j]!.letter === "") {
          grid[i]![j]!.letter =
            alphabet[Math.floor(Math.random() * alphabet.length)]!;
        }
      }
    }

    return grid;
  }
}
