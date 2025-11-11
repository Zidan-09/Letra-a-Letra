import type {
  CellKeys,
  CellUpdate,
  MoveEmit,
} from "../../../../utils/room_utils";

export function unblockHandler(
  data: MoveEmit,
  copy: { [x: CellKeys]: CellUpdate },
  player_id: string
) {
  if (data.cell) {
    const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
    copy[key] = {
      ...copy[key],
      blocked: { blocked_by: undefined, remaining: undefined },
      letter: data.letter,
      actor: player_id,
    };
  }

  return copy;
}
