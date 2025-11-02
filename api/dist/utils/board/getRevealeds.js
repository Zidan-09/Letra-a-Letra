"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevealeds = getRevealeds;
function getRevealeds(board) {
    if (!board)
        return undefined;
    let result = [];
    for (let i of board.grid) {
        for (let j of i) {
            if (j.revealed.status)
                result.push({
                    letter: j.letter,
                    x: j.position.x,
                    y: j.position.y,
                    by: j.revealed.revealed_by,
                });
        }
    }
    return result;
}
//# sourceMappingURL=getRevealeds.js.map