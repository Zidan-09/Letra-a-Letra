import { Board } from "../entities/board";
import { Themes } from "../utils/board_utils/themesEnum";

const game = new Board(Themes.RANDOM);
const grid = game.grid;

console.warn("Letras:\n");

grid.forEach(row => {
    row.forEach(cell => {
        process.stdout.write(`${cell.letter}    `);
    })
    console.log("\n");
})

console.log(game.words);