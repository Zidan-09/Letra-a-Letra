import type { Dispatch, RefObject, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  MoveEmit,
} from "../../../../utils/room_utils";

export function spyHandler(
  key: CellKeys | null,
  copy: { [x: CellKeys]: CellUpdate },
  data: MoveEmit,
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>,
  spyTimers: RefObject<Map<string, number>>
) {
  if (!key) return copy;

  copy[key] = {
    ...copy[key],
    letter: data.letter,
    spied: true,
  };

  const timer = window.setTimeout(() => {
    setCells((prev) => {
      const updated = { ...prev };
      if (updated[key]?.spied) {
        updated[key] = {
          ...updated[key],
          letter: undefined,
          spied: false,
        };
      }
      return updated;
    });
    spyTimers.current.delete(key);
  }, 10000);

  spyTimers.current.set(key, timer);
  return copy;
}
