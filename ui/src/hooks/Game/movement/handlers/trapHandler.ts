import type { Dispatch, SetStateAction } from "react";
import type {
  CellKeys,
  CellUpdate,
  MoveEmit,
} from "../../../../utils/room_utils";
import { trapTrigged } from "../utils/trapTrigged";

export function trapHandler(
  data: MoveEmit,
  copy: { [x: CellKeys]: CellUpdate },
  player_id: string,
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>
) {
  if (data.cell) {
    const key = `${data.cell.x}-${data.cell.y}` as CellKeys;

    if (data.status === "trap_trigged") {
      copy = trapTrigged(copy, data, key, setCells);
      return copy;
    }

    copy[key] = {
      ...copy[key],
      trapped_by: data.trapped_by,
      actor: player_id,
    };
  }

  return copy;
}
