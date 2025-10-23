"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeWord = placeWord;
function placeWord(word, row, column, dx, dy, grid, wordPositions) {
    const positions = [];
    for (let i = 0; i < word.length; i++) {
        const x = row + dx * i;
        const y = column + dy * i;
        grid[x][y].letter = word[i];
        positions.push([x, y]);
    }
    wordPositions[word] = positions;
}
//# sourceMappingURL=placeWord.js.map