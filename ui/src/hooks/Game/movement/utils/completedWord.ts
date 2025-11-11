import type { Dispatch, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  CompletedWord,
  MoveEmit,
} from "../../../../utils/room_utils";

export function completedWord(
  data: MoveEmit,
  setFindeds: Dispatch<SetStateAction<CompletedWord[]>>,
  player_id: string,
  copy: { [x: CellKeys]: CellUpdate }
) {
  if (data.completedWord) {
    const find: CompletedWord | undefined = data.completedWord
      ? {
          finded_by: player_id,
          finded: data.completedWord.word,
          positions: data.completedWord.positions,
        }
      : undefined;

    if (find) setFindeds((prev) => [...prev, find]);

    data.completedWord.positions.forEach((p) => {
      const key = `${p[0]}-${p[1]}` as CellKeys;
      copy[key] = {
        ...copy[key],
        finded_by: player_id,
      };
    });
  }
  
  return copy;
}
