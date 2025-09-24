import { MovementsEnum } from "../utils/board_utils/movementsEnum";
import { PowerRarity } from "../utils/cell_utils/powerRarity";
import data from "../settings/cell.json";

export class Cell {
    letter: string;
    position: { x: number; y: number};
    blocked: { status: boolean; blocked_by: string | null };
    trapped: { status: boolean, trapped_by: string | null };
    clicks: number = 0;
    revealed: boolean = false;
    power: { hasPowerup: boolean, rarity?: PowerRarity, powerup: MovementsEnum | null }

    constructor(letter: string, x: number, y: number) {
        this.letter = letter;
        this.position = { x: x, y: y };
        this.blocked = { status: false, blocked_by: null }
        this.trapped = { status: false, trapped_by: null }
        this.power = this.powerup();
    }

    resetCell() {
        this.blocked.status = false;
        this.blocked.blocked_by = null;

        this.trapped.status = false;
        this.trapped.trapped_by = null;
        
        this.clicks = 0;
    }

    powerup(): { hasPowerup: boolean, rarity?: PowerRarity, powerup: MovementsEnum | null } {
        const chance = data.settings.chancePerCell;
        const powers = Object.values(MovementsEnum);
        powers.shift();

        if (Math.random() < chance / 100) {
            const roll = Math.random();

            const rare = data.settings.percentages.rare;
            const epic = data.settings.percentages.epic;
            const legend = data.settings.percentages.legendary;

            if (roll <= legend) {
                var index = Math.floor(Math.random() * data.powers.legendary.length);
                return {
                    hasPowerup: true,
                    rarity: data.powers.legendary[index]!.rarity as PowerRarity,
                    powerup: data.powers.legendary[index]!.name as MovementsEnum
                }

            } else if (roll <= epic) {
                var index = Math.floor(Math.random() * data.powers.epic.length);
                return {
                    hasPowerup: true,
                    rarity: data.powers.epic[index]!.rarity as PowerRarity,
                    powerup: data.powers.epic[index]!.name as MovementsEnum
                }

            } else if (roll <= rare) {
                var index = Math.floor(Math.random() * data.powers.rare.length);
                return {
                    hasPowerup: true,
                    rarity: data.powers.rare[index]!.rarity as PowerRarity,
                    powerup: data.powers.rare[index]!.name as MovementsEnum
                }

            } else {
                var index = Math.floor(Math.random() * data.powers.common.length);
                return {
                    hasPowerup: true,
                    rarity: data.powers.common[index]!.rarity as PowerRarity,
                    powerup: data.powers.common[index]!.name as MovementsEnum
                }
            }
        }

        return {
            hasPowerup: false,
            powerup: null
        }
    }
}