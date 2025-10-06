import { MovementsEnum } from "../board_utils/movementsEnum";
import { MoveEmit } from "../emits/gameEmits";
import { SendSocket } from "../game_utils/sendSocket";

export function HandleSocket(room_id: string, player_id: string, movement: MovementsEnum, powerIdx: number | undefined, data: MoveEmit) {
    if ([MovementsEnum.TRAP, MovementsEnum.DETECT_TRAPS, MovementsEnum.SPY].includes(movement)) {
        SendSocket.movementOne(room_id, player_id, movement, powerIdx, data);
        SendSocket.movementAll(room_id, player_id, movement, powerIdx, data.status);
        
    } else {
        SendSocket.movementAll(room_id, player_id, movement, powerIdx, data);
    }
}