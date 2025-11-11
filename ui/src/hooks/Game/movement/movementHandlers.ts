import type { Dispatch, RefObject, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  CompletedWord,
  MoveEmit,
  MovementsEnum,
  Player,
} from "../../../utils/room_utils";
import { blockHandler } from "./handlers/blockHandler";
import { unblockHandler } from "./handlers/unblockHandler";
import { completedWord } from "./utils/completedWord";
import { trapHandler } from "./handlers/trapHandler";
import { detectTrapsHandler } from "./handlers/detectTrapsHandler";
import { spyHandler } from "./handlers/spyHandler";
import { revealHandler } from "./handlers/revealHandler";

export function MovementHandlers(
  setTurn: Dispatch<SetStateAction<number>>,
  turn: number,
  turnStartRef: RefObject<number>,
  setP1: Dispatch<SetStateAction<Player | undefined>>,
  setP2: Dispatch<SetStateAction<Player | undefined>>,
  players: Player[],
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>,
  data: MoveEmit,
  spyTimers: RefObject<Map<string, number>>,
  movement: MovementsEnum,
  player_id: string,
  setFindeds: Dispatch<SetStateAction<CompletedWord[]>>,
  setHidedLetters: Dispatch<SetStateAction<CellUpdate[]>>,
  setHidedWords: Dispatch<
    SetStateAction<
      { finded_by: string; finded: string; positions: [number, number][] }[]
    >
  >
) {
  setTurn(turn);
  turnStartRef.current = Date.now();
  
  let p1Data: Player;

  setP1((prev) => {
    if (!prev) return prev;

    const copy = { ...prev };
    const player = players.find((p) => p.player_id === copy.player_id);

    if (!player) return prev;
    p1Data = player;

    return player;
  });

  setP2((prev) => {
    if (!prev) return prev;

    const copy = { ...prev };
    const player = players.find((p) => p.player_id === copy.player_id);

    if (!player) return prev;

    return player;
  });

  setCells((prev) => {
    let copy = { ...prev };
    const key = data.cell
      ? (`${data.cell.x}-${data.cell.y}` as CellKeys)
      : null;

    if (key) {
      const oldTimer = spyTimers.current.get(key);
      if (oldTimer) {
        clearTimeout(oldTimer);
        spyTimers.current.delete(key);
      }
    }

    switch (movement) {
      case "BLOCK":
        copy = blockHandler(data, copy);

        break;
      case "UNBLOCK":
        copy = unblockHandler(data, copy, player_id);

        copy = completedWord(data, setFindeds, player_id, copy);

        break;
      case "TRAP":
        copy = trapHandler(data, copy, player_id, setCells);

        break;
      case "DETECT_TRAPS":
        copy = detectTrapsHandler(data, copy);

        break;
      case "SPY":
        copy = spyHandler(key, copy, data, setCells, spyTimers);
        break;

      case "REVEAL":
        copy = revealHandler(
          data,
          p1Data,
          copy,
          player_id,
          setHidedLetters,
          setHidedWords,
          setFindeds,
          setCells
        );

        copy = completedWord(data, setFindeds, player_id, copy);

        break;
    }

    return copy;
  });
}
