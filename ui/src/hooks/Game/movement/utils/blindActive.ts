import type { Dispatch, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  CompletedWord,
  MoveEmit,
} from "../../../../utils/room_utils";

export function blindActive(
  copy: { [x: CellKeys]: CellUpdate },
  key: CellKeys,
  data: MoveEmit,
  player_id: string,
  setHidedLetters: Dispatch<SetStateAction<CellUpdate[]>>,
  setHidedWords: Dispatch<
    SetStateAction<
      { finded_by: string; finded: string; positions: [number, number][] }[]
    >
  >,
  setFindeds: Dispatch<SetStateAction<CompletedWord[]>>
) {
  const newHideLetter: CellUpdate = {
    ...copy[key],
    x: data.cell!.x,
    y: data.cell!.y,
    letter: data.letter,
    actor: player_id,
  };

  const newFind: CompletedWord | undefined = data.completedWord
    ? {
        finded_by: player_id,
        finded: data.completedWord.word,
        positions: data.completedWord.positions,
      }
    : undefined;

  setHidedLetters((prev) => [...prev, newHideLetter]);

  if (newFind) {
    setHidedWords((prev) => [...prev, newFind]);
    setFindeds((prev) => [...prev, newFind]);
  }

  copy[key] = {
    ...copy[key],
    revealed: true,
  };

  return copy;
}
