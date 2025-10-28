import { MovementsEnum } from "../utils/game/movementsEnum";
import { PowerRarity } from "../utils/cell/powerRarity";
import { GameModes } from "../utils/game/gameModes";
import data from "../settings/cell.json";

export class Cell {
    letter: string;
    position: { x: number; y: number};
    blocked: { status: boolean; blocked_by: string | null };
    trapped: { status: boolean, trapped_by: string | null };
    clicks: number = 0;
    revealed: { status: boolean, revealed_by: string | null };
    power: { hasPowerup: boolean, rarity?: PowerRarity, powerup?: MovementsEnum | null }

    constructor(letter: string, x: number, y: number, gamemode: GameModes, allowedPowers: MovementsEnum[]) {
        this.letter = letter;
        this.position = { x: x, y: y };
        this.blocked = { status: false, blocked_by: null };
        this.trapped = { status: false, trapped_by: null };
        this.revealed = { status: false, revealed_by: null };
        this.power = this.powerup(gamemode, allowedPowers);
    }

    resetCell() {
        this.blocked.status = false;
        this.blocked.blocked_by = null;

        this.trapped.status = false;
        this.trapped.trapped_by = null;
        
        this.clicks = 0;
    }

    powerup(
        gamemode: GameModes, 
        allowedPowers: MovementsEnum[]
    ): { hasPowerup: boolean; rarity?: PowerRarity; powerup: MovementsEnum | null } {

        const chance = gamemode === GameModes.NORMAL ? data.settings.chancePerCell : 100;

        if (Math.random() >= chance / 100) return { hasPowerup: false, powerup: null };

        const roll = Math.random();
        const { rare, epic, legendary } = data.settings.percentages;

        const getRandomAllowedPower = (powers: typeof data.powers.common) => {
            const filtered = powers.filter(p => allowedPowers.includes(p.name as MovementsEnum));
            if (filtered.length === 0) return null;
            const index = Math.floor(Math.random() * filtered.length);
            return filtered[index];
        };

        let chosenPower =
            roll <= legendary ? getRandomAllowedPower(data.powers.legendary) : null;

        if (!chosenPower && roll <= epic) chosenPower = getRandomAllowedPower(data.powers.epic);
        if (!chosenPower && roll <= rare) chosenPower = getRandomAllowedPower(data.powers.rare);
        if (!chosenPower) chosenPower = getRandomAllowedPower(data.powers.common);

        if (!chosenPower) {
            const allPowers = [
                ...data.powers.legendary,
                ...data.powers.epic,
                ...data.powers.rare,
                ...data.powers.common
            ];
            chosenPower = allPowers.find(p => allowedPowers.includes(p.name as MovementsEnum)) || null;
        }

        if (chosenPower) {
            return {
                hasPowerup: true,
                rarity: chosenPower.rarity as PowerRarity,
                powerup: chosenPower.name as MovementsEnum
            };
        }

        return { hasPowerup: false, powerup: null };
    }

}