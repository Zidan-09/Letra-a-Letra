import type {
  CellKeys,
  CellUpdate,
  MoveEmit,
} from "../../../../utils/room_utils";

export function detectTrapsHandler(
  data: MoveEmit,
  copy: { [x: CellKeys]: CellUpdate }
) {
  if (data.traps) {
    data.traps.forEach((trap) => {
      const key = `${trap.x}-${trap.y}` as CellKeys;
      copy[key] = {
        ...copy[key],
        detected: true,
        trapped_by: data.trapped_by,
      };
    });
  }

  return copy;
}
