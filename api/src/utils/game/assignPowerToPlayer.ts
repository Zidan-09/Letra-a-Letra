import { Cell } from "../../entities/cell";
import { Player } from "../../entities/player";

export function assignPowerToPlayer(cell: Cell, player: Player) {
    if (player.powers.length === 5) return;

    const effectPowers = ["BLIND", "LANTERN", "FREEZE", "UNFREEZE", "IMMUNITY", "DETECT_TRAPS"];

    if (cell.power.hasPowerup && cell.power.powerup && cell.power.rarity) {
        player.powers.push({
            power: cell.power.powerup,
            rarity: cell.power.rarity,
            type: effectPowers.includes(cell.power.powerup) ? "effect" : "manipulation"
        });
    }
}
