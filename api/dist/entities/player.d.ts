import { MovementsEnum } from "../utils/game/movementsEnum";
import { PowerRarity } from "../utils/cell/powerRarity";
interface PlayerEffect {
    active: boolean;
    remaining: number | null;
}
type EffectKey = "freeze" | "blind" | "immunity";
export declare class Player {
    player_id: string;
    nickname: string;
    spectator: boolean;
    turn: 0 | 1;
    avatar: number;
    score: number;
    passed: number;
    leaved: number;
    timeOut?: NodeJS.Timeout;
    ban: boolean;
    powers: {
        power: MovementsEnum;
        rarity: PowerRarity;
        type: "manipulation" | "effect";
    }[];
    freeze: PlayerEffect;
    blind: PlayerEffect;
    immunity: PlayerEffect;
    constructor(player_id: string, nickname: string, spectator: boolean, avatar: number);
    addScore(): void;
    addPass(): void;
    resetPass(): void;
    discardPower(powerIdx: number): void;
    applyEffect(effect: EffectKey, duration: number): void;
    removeEffect(effect: EffectKey): void;
    decrementEffect(): void;
    reset(): void;
}
export {};
//# sourceMappingURL=player.d.ts.map