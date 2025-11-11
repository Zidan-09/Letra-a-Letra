import type {
  CellKeys,
  CellUpdate,
  MoveEmit,
} from "../../../../utils/room_utils";

export function blockHandler(
  data: MoveEmit,
  copy: { [x: CellKeys]: CellUpdate }
) {
  if (data.cell) {
    const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
    copy[key] = {
      ...copy[key],
      blocked: {
        blocked_by: data.blocked_by,
        remaining: data.remaining,
      },
    };
  }

  return copy;
}
