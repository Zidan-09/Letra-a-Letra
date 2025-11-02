"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleSocket = HandleSocket;
const movementsEnum_1 = require("../game/movementsEnum");
const gameSocket_1 = require("../socket/gameSocket");
function HandleSocket(room_id, player_id, movement, data) {
    if ([
        movementsEnum_1.MovementsEnum.TRAP,
        movementsEnum_1.MovementsEnum.DETECT_TRAPS,
        movementsEnum_1.MovementsEnum.SPY,
    ].includes(movement)) {
        gameSocket_1.GameSocket.movementOne(room_id, player_id, movement, data);
    }
    else {
        gameSocket_1.GameSocket.movementAll(room_id, player_id, movement, data);
    }
}
//# sourceMappingURL=handleSocket.js.map