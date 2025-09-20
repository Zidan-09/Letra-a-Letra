import { selectTheme } from "../utils/board_utils/selectTheme";
import { placeWord } from "../utils/board_utils/placeWord";
import { canPlaceWord } from "../utils/board_utils/canPlaceWord";
import { Cell } from "./cell";
import { Themes } from "../utils/board_utils/themesEnum";
import config from "../config/board.json";

export class Board {
    range: number = config.range;
    words: string[];
    finded: number = 0;
    grid: Cell[][];
    wordPositions: { [word: string]: [number, number][] } = {};

    constructor(theme: Themes) {
        this.words = selectTheme(theme);
        this.grid = this.createBoard(this.words);
    }

    createBoard(words: string[]): Cell[][] {
        const grid: Cell[][] = Array.from({ length: this.range + 1}, (_, x) => 
            Array.from({ length: this.range + 1 }, (_, y) => new Cell("", x, y))
        );

        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [-1, -1], [1, -1], [-1, 1]
        ];

        words.forEach(word => {
            let placed = false;

            while (!placed) {
                const row = Math.floor(Math.random() * (this.range + 1));
                const column = Math.floor(Math.random() * (this.range + 1));
                const [dx, dy] = directions[Math.floor(Math.random() * directions.length)]!;

                if (canPlaceWord(word, row, column, dx!, dy!, grid)) {
                    placeWord(word, row, column, dx!, dy!, grid, this.wordPositions);
                    placed = true;
                }
            }
        })

        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i <= this.range; i++) {
            for (let j = 0; j <= this.range; j++) {
                if (grid[i]![j]!.letter === '') {
                    grid[i]![j]!.letter = alphabet[Math.floor(Math.random() * alphabet.length)]!;
                }
            }
        }

        return grid;
    }
}