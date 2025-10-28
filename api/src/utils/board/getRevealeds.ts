import { Board } from "../../entities/board";

export function getRevealeds(board: Board | null): { letter: string, x: number, y: number, by: string }[] | undefined {
  if (!board) return undefined;

  let result: { letter: string, x: number, y: number, by: string }[] = [];

  for (let i of board.grid) {
    for (let j of i) {
      if (j.revealed.status) result.push({
        letter: j.letter,
        x: j.position.x,
        y: j.position.y,
        by: j.revealed.revealed_by!
      })
    };
  };

  return result;
};