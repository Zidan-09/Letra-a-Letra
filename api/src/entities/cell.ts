import { MovementsEnum } from "../utils/board_utils/movementsEnum";
import { PowerRarity } from "../utils/cell_utils/powerRarity";
import { commomPowers, epicPowers, legendaryPowers, rarePowers } from "../utils/cell_utils/powers";

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
        const chance = 12;
        const powers = Object.values(MovementsEnum);
        powers.shift();

        if (Math.random() < chance / 100) {
            const roll = Math.random();

            const rare = 0.30;
            const epic = 0.10;
            const legend = 0.05;

            console.log(roll);

            if (roll <= legend) {
                var index = Math.floor(Math.random() * legendaryPowers.length);
                return {
                    hasPowerup: true,
                    rarity: legendaryPowers[index]!.rarity,
                    powerup: legendaryPowers[index]!.name as MovementsEnum
                }

            } else if (roll <= epic) {
                var index = Math.floor(Math.random() * epicPowers.length);
                return {
                    hasPowerup: true,
                    rarity: epicPowers[index]!.rarity,
                    powerup: epicPowers[index]!.name as MovementsEnum
                }

            } else if (roll <= rare) {
                var index = Math.floor(Math.random() * rarePowers.length);
                return {
                    hasPowerup: true,
                    rarity: rarePowers[index]!.rarity,
                    powerup: rarePowers[index]!.name as MovementsEnum
                }

            } else {
                var index = Math.floor(Math.random() * commomPowers.length);
                return {
                    hasPowerup: true,
                    rarity: commomPowers[index]!.rarity,
                    powerup: commomPowers[index]!.name as MovementsEnum
                }
            }
        }

        return {
            hasPowerup: false,
            powerup: null
        }
    }
}