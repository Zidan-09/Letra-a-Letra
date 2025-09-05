import { Board } from "../entities/board";

const board = new Board();
const {grid, words, bools} = board.debug();

console.log(words)

console.table(bools)

const teste: string[][] = new Array(10).fill('*').map(() => new Array(10).fill('*'));

console.log('--------------------------------------TESTES--------------------------------------')

const commands = [[1, 4], [9, 9], [5, 7], [5, 8], [8, 9], [0, 1], [3, 2], [3, 3], [9, 1], [3, 4]]

commands.forEach(i => {
    let letter = board.revealLetter(i[0]!, i[1]!);
    teste[i[0]!]![i[1]!] = letter!;
    console.table(teste);
})