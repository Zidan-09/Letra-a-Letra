"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWordCompletion = checkWordCompletion;
function checkWordCompletion(board, row, column) {
    for (const [word, positions] of Object.entries(board.wordPositions)) {
        if (positions.some(([r, c]) => r === row && c === column)) {
            const completed = positions.every(([r, c]) => board.grid[r][c].revealed.status);
            if (completed) {
                board.findedWords.push(word);
                return {
                    completedWord: word,
                    positions: positions
                };
            }
        }
    }
    return false;
}
//# sourceMappingURL=checkCompletedWord.js.map