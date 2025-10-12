import { Cell } from "../../entities/cell";

export function placeWord(
    word: string,
    row: number, 
    column: number, 
    dx: number, 
    dy: number, 
    grid: Cell[][], 
    wordPositions: { [word: string]: [number, number][] }
) {
    const positions: [number, number][] = [];

    for (let i = 0; i < word.length; i++) {
        const x = row + dx * i;
        const y = column + dy * i;

        grid[x]![y]!.letter = word[i]!;
        positions.push([x, y]);
    }

    wordPositions[word] = positions;
}