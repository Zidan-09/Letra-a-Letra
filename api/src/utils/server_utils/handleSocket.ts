import { MovementsEnum } from "../board_utils/movementsEnum";
import { MoveEmit } from "../emits/gameEmits";
import { SendSocket } from "../game_utils/sendSocket";

export function HandleSocket(room_id: string, player_id: string, movement: MovementsEnum, data: MoveEmit) {
    if ([MovementsEnum.TRAP, MovementsEnum.DETECTTRAPS, MovementsEnum.SPY].includes(movement)) {
        SendSocket.movementOne(room_id, player_id, movement, data);
        SendSocket.movementAll(room_id, player_id, movement, data.status);
        
    } else {
        SendSocket.movementAll(room_id, player_id, movement, data);
    }
}