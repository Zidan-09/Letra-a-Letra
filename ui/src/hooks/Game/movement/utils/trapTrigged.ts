import type { Dispatch, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  MoveEmit,
} from "../../../../utils/room_utils";

export function trapTrigged(
  copy: { [x: CellKeys]: CellUpdate },
  data: MoveEmit,
  key: CellKeys,
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>
) {
  if (!copy[key]) return copy;

  copy[key] = {
    ...copy[key],
    trapTrigged: true,
    trapped_by: data.trapped_by,
  };

  const resetCell = () => {
    setCells((prev) => {
      const updated = { ...prev };
      const cell = updated[key];
      if (!cell) return updated;

      updated[key] = {
        ...cell,
        trapped_by: undefined,
        trapTrigged: false,
        detected: false,
        actor: undefined,
      };

      return updated;
    });
  };

  setTimeout(resetCell, 1500);

  return copy;
}
