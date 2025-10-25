"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ban = void 0;
exports.Ban = {
    setPlayerTimeout(player) {
        this.removePlayerTimeout(player);
        player.ban = true;
        player.timeOut = setTimeout(() => {
            player.ban = false;
        }, 30 * 1000 * 60);
    },
    setBan(player) {
        this.removePlayerTimeout(player);
        player.ban = true;
    },
    removePlayerTimeout(player) {
        if (player.timeOut)
            clearTimeout(player.timeOut);
    },
    removeBan(player) {
        player.ban = false;
    },
};
//# sourceMappingURL=ban.js.map