export const Movements = {
    REVEAL: "REVEAL",
    BLOCK: "BLOCK",
    UNBLOCK: "UNBLOCK",
    TRAP: "TRAP",
    DETECTTRAPS: "DETECTTRAPS",
    FREEZE: "FREEZE",
    UNFREEZE: "UNFREEZE",
    SPY: "SPY",
    BLIND: "BLIND",
    LANTERN: "LANTERN",
    IMMUNITY: "IMMUNITY"
} as const;

export type MovementsList = typeof Movements[keyof typeof Movements];