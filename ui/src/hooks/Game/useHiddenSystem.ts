import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { CellKeys, CellUpdate, Game, Player } from "../../utils/room_utils";

export function useHiddenSystem(
  room: Game | undefined,
  p1: Player | undefined,
  hidedLetters: CellUpdate[],
  hidedWords: { finded_by: string; finded: string; positions: [number, number][] }[],
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>,
  setHidedLetters: Dispatch<SetStateAction<CellUpdate[]>>,
  setHidedWords: Dispatch<SetStateAction<{ finded_by: string; finded: string; positions: [number, number][] }[]>>
) {
  useEffect(() => {
    if (!room || !p1) return;
    if (p1.blind.active) return;
    if (hidedLetters.length === 0 && hidedWords.length === 0) return;

    setCells((prev) => {
      const copy = { ...prev };

      hidedLetters.forEach((data) => {
        const key = `${data.x}-${data.y}` as CellKeys;
        copy[key] = {
          ...copy[key],
          letter: data.letter,
          actor: data.actor,
        };
      });

      hidedWords.forEach((p) => {
        p.positions.forEach((pos) => {
          const key = `${pos[0]}-${pos[1]}` as CellKeys;
          copy[key] = {
            ...copy[key],
            finded_by: p.finded_by,
          };
        });
      });

      return copy;
    });

    setHidedLetters([]);
    setHidedWords([]);
  }, [p1?.blind.active]);
};