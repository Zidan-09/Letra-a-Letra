import { Cell } from "../../entities/cell";

export function canPlaceWord(
  word: string,
  row: number,
  column: number,
  dx: number,
  dy: number,
  grid: Cell[][]
): boolean {
  for (let i = 0; i < word.length; i++) {
    const x = row + dx * i;
    const y = column + dy * i;

    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0]!.length) {
      return false;
    }

    if (grid[x]![y]!.letter !== "" && grid[x]![y]!.letter !== word[i]) {
      return false;
    }
  }

  return true;
}
