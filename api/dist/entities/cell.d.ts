import { MovementsEnum } from "../utils/game/movementsEnum";
import { PowerRarity } from "../utils/cell/powerRarity";
import { GameModes } from "../utils/game/gameModes";
export declare class Cell {
    letter: string;
    position: {
        x: number;
        y: number;
    };
    blocked: {
        status: boolean;
        blocked_by: string | null;
    };
    trapped: {
        status: boolean;
        trapped_by: string | null;
    };
    clicks: number;
    revealed: boolean;
    power: {
        hasPowerup: boolean;
        rarity?: PowerRarity;
        powerup?: MovementsEnum | null;
    };
    constructor(letter: string, x: number, y: number, gamemode: GameModes, allowedPowers: MovementsEnum[]);
    resetCell(): void;
    powerup(gamemode: GameModes, allowedPowers: MovementsEnum[]): {
        hasPowerup: boolean;
        rarity?: PowerRarity;
        powerup: MovementsEnum | null;
    };
}
//# sourceMappingURL=cell.d.ts.map