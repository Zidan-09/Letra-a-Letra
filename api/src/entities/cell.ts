import { MovementsEnum } from "../utils/board_utils/movementsEnum";

export class Cell {
    letter: string;
    position: { x: number; y: number};
    blocked: { status: boolean; blocked_by: string | null };
    trapped: { status: boolean, trapped_by: string | null };
    clicks: number = 0;
    revealed: boolean = false;
    power: { hasPowerup: boolean, powerup: MovementsEnum | null }

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

    powerup(): { hasPowerup: boolean, powerup: MovementsEnum | null } {
        const chance = 12;
        const powers = Object.values(MovementsEnum);

        if (Math.random() < chance / 100) {
            const index = Math.floor(Math.random() * powers.length);
            return {
                hasPowerup: true,
                powerup: powers[index] as MovementsEnum
            };
        }

        return {
            hasPowerup: false,
            powerup: null
        }
    }
}