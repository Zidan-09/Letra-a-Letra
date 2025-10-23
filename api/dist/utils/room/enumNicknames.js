"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumNicknames = enumNicknames;
function enumNicknames(all) {
    const playersList = all.filter((p) => Boolean(p));
    const nicknameGroups = {};
    for (const player of playersList) {
        const baseName = player.nickname.replace(/\s+\d+$/, "").trim();
        player.nickname = baseName;
        if (!nicknameGroups[baseName])
            nicknameGroups[baseName] = [];
        nicknameGroups[baseName].push(player);
    }
    for (const [baseName, players] of Object.entries(nicknameGroups)) {
        if (players.length > 1) {
            players.forEach((player, index) => {
                player.nickname = `${baseName} ${index + 1}`;
            });
        }
        else {
            players[0].nickname = baseName;
        }
    }
}
//# sourceMappingURL=enumNicknames.js.map