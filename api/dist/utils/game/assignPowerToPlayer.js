"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPowerToPlayer = assignPowerToPlayer;
function assignPowerToPlayer(cell, player) {
    if (player.powers.length === 5)
        return;
    const effectPowers = [
        "BLIND",
        "LANTERN",
        "FREEZE",
        "UNFREEZE",
        "IMMUNITY",
        "DETECT_TRAPS",
    ];
    if (cell.power.hasPowerup && cell.power.powerup && cell.power.rarity) {
        player.powers.push({
            power: cell.power.powerup,
            rarity: cell.power.rarity,
            type: effectPowers.includes(cell.power.powerup)
                ? "effect"
                : "manipulation",
        });
    }
}
//# sourceMappingURL=assignPowerToPlayer.js.map