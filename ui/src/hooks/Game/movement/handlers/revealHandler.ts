import type { Dispatch, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  CompletedWord,
  MoveEmit,
  Player,
} from "../../../../utils/room_utils";
import { trapTrigged } from "../utils/trapTrigged";
import { blindActive } from "../utils/blindActive";

export function revealHandler(
  data: MoveEmit,
  p1Data: Player,
  copy: { [x: CellKeys]: CellUpdate },
  player_id: string,
  setHidedLetters: Dispatch<SetStateAction<CellUpdate[]>>,
  setHidedWords: Dispatch<
    SetStateAction<
      { finded_by: string; finded: string; positions: [number, number][] }[]
    >
  >,
  setFindeds: Dispatch<SetStateAction<CompletedWord[]>>,
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>
) {
  if (data.cell) {
    const key = `${data.cell.x}-${data.cell.y}` as CellKeys;

    if (p1Data.blind.active) {
      copy = blindActive(copy, key, data, player_id, setHidedLetters, setHidedWords, setFindeds);
      return copy;
    }

    if (data.status === "trap_trigged") {
      copy = trapTrigged(copy, data, key, setCells);
      return copy;
    }

    if (data.status === "blocked") {
      copy[key] = {
        ...copy[key],
        blocked: {
          blocked_by: copy[key].blocked?.blocked_by,
          remaining: data.remaining,
        },
      };

      return copy;
    }

    copy[key] = {
      ...copy[key],
      letter: data.letter,
      revealed: true,
      trapped_by: undefined,
      blocked: { blocked_by: undefined, remaining: undefined },
      actor: player_id,
    };
  }

  return copy;
}
