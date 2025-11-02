"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const gameModes_1 = require("../utils/game/gameModes");
const cell_json_1 = __importDefault(require("../settings/cell.json"));
class Cell {
    constructor(letter, x, y, gamemode, allowedPowers) {
        this.clicks = 0;
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
    powerup(gamemode, allowedPowers) {
        const chance = gamemode === gameModes_1.GameModes.NORMAL ? cell_json_1.default.settings.chancePerCell : 100;
        if (Math.random() >= chance / 100)
            return { hasPowerup: false, powerup: null };
        const roll = Math.random();
        const { rare, epic, legendary } = cell_json_1.default.settings.percentages;
        const getRandomAllowedPower = (powers) => {
            const filtered = powers.filter((p) => allowedPowers.includes(p.name));
            if (filtered.length === 0)
                return null;
            const index = Math.floor(Math.random() * filtered.length);
            return filtered[index];
        };
        let chosenPower = roll <= legendary ? getRandomAllowedPower(cell_json_1.default.powers.legendary) : null;
        if (!chosenPower && roll <= epic)
            chosenPower = getRandomAllowedPower(cell_json_1.default.powers.epic);
        if (!chosenPower && roll <= rare)
            chosenPower = getRandomAllowedPower(cell_json_1.default.powers.rare);
        if (!chosenPower)
            chosenPower = getRandomAllowedPower(cell_json_1.default.powers.common);
        if (!chosenPower) {
            const allPowers = [
                ...cell_json_1.default.powers.legendary,
                ...cell_json_1.default.powers.epic,
                ...cell_json_1.default.powers.rare,
                ...cell_json_1.default.powers.common,
            ];
            chosenPower =
                allPowers.find((p) => allowedPowers.includes(p.name)) || null;
        }
        if (chosenPower) {
            return {
                hasPowerup: true,
                rarity: chosenPower.rarity,
                powerup: chosenPower.name,
            };
        }
        return { hasPowerup: false, powerup: null };
    }
}
exports.Cell = Cell;
//# sourceMappingURL=cell.js.map