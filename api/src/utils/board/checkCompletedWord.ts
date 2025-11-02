import { Board } from "../../entities/board";

export function checkWordCompletion(board: Board, row: number, column: number) {
  for (const [word, positions] of Object.entries(board.wordPositions)) {
    if (positions.some(([r, c]) => r === row && c === column)) {
      const completed = positions.every(
        ([r, c]) => board.grid[r]![c]!.revealed.status
      );

      if (completed) {
        board.findedWords.push(word);

        return {
          completedWord: word,
          positions: positions,
        };
      }
    }
  }

  return false;
}
