import { MovementsEnum } from "../game/movementsEnum";
import { MoveEmit } from "../socket/gameEmits";
import { GameSocket } from "../socket/gameSocket";

export function HandleSocket(
  room_id: string,
  player_id: string,
  movement: MovementsEnum,
  data: MoveEmit
) {
  if (
    [
      MovementsEnum.TRAP,
      MovementsEnum.DETECT_TRAPS,
      MovementsEnum.SPY,
    ].includes(movement)
  ) {
    GameSocket.movementOne(room_id, player_id, movement, data);
  } else {
    GameSocket.movementAll(room_id, player_id, movement, data);
  }
}
