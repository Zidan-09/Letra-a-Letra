import { Cell } from "../../entities/cell";
import { Player } from "../../entities/player";

export function assignPowerToPlayer(cell: Cell, player: Player) {
    if (player.powers.length === 5) return;

    if (cell.power.hasPowerup && cell.power.powerup && cell.power.rarity) {
        player.powers.push({
            power: cell.power.powerup,
            rarity: cell.power.rarity
        });
    }
}
