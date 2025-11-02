"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const selectTheme_1 = require("../utils/board/selectTheme");
const placeWord_1 = require("../utils/board/placeWord");
const canPlaceWord_1 = require("../utils/board/canPlaceWord");
const cell_1 = require("./cell");
const board_json_1 = __importDefault(require("../settings/board.json"));
class Board {
    constructor(theme, gamemode, allowedPowers) {
        this.range = board_json_1.default.range;
        this.finded = 0;
        this.findedWords = [];
        this.wordPositions = {};
        this.words = (0, selectTheme_1.selectTheme)(theme);
        this.grid = this.createBoard(this.words, gamemode, allowedPowers);
    }
    createBoard(words, gamemode, allowedPowers) {
        const grid = Array.from({ length: this.range + 1 }, (_, x) => Array.from({ length: this.range + 1 }, (_, y) => new cell_1.Cell("", x, y, gamemode, allowedPowers)));
        const directions = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
        ];
        words.forEach((word) => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * (this.range + 1));
                const column = Math.floor(Math.random() * (this.range + 1));
                const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
                if ((0, canPlaceWord_1.canPlaceWord)(word, row, column, dx, dy, grid)) {
                    (0, placeWord_1.placeWord)(word, row, column, dx, dy, grid, this.wordPositions);
                    placed = true;
                }
            }
        });
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i <= this.range; i++) {
            for (let j = 0; j <= this.range; j++) {
                if (grid[i][j].letter === "") {
                    grid[i][j].letter =
                        alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }
        return grid;
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map