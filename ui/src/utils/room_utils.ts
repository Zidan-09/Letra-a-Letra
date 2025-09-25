interface Game {
    room_id: string;
    room_name: string;
    allowedPowers: MovementsEnum[];
    gameMode: GameModes;
    status: GameStatus;
    players: Player[];
    spectators: Player[];
    created_by: string;
    turn: number;
    time_turn: number;
    board: Board | null;
    haveSpectators: boolean;
    privateRoom: boolean;
}

interface Player {
    player_id: string;
    nickname: string;
    spectator: boolean;
    turn: 0 | 1;
    score: number;
    passed: number;
    freeze: PlayerEffect;
    blind: PlayerEffect;
    immunity: PlayerEffect;
}

interface PlayerEffect {
    active: boolean,
    remaining: number | null;
}

interface Board {
    range: number;
    words: string[];
    finded: number;
    grid: Cell[][];
    wordPositions: { [word: string]: [number, number][] };
}

interface Cell {
    letter: string;
    position: { x: number; y: number};
    blocked: { status: boolean; blocked_by: string | null };
    trapped: { status: boolean, trapped_by: string | null };
    clicks: number;
    revealed: boolean;
    power: { hasPowerup: boolean, rarity?: PowerRarity, powerup: MovementsEnum | null }
}

type GameModes = "NORMAL" | "CRAZY"

type PowerRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

type MovementsEnum = "REVEAL" | "BLOCK" | "UNBLOCK" | "TRAP" | "DETECTTRAPS" | "FREEZE" | "UNFREEZE" | "SPY" | "BLIND" | "LANTERN" | "IMMUNITY";

type GameStatus = "game_starting" | "game_running" | "game_over";

export type { Game, GameStatus, Player, PlayerEffect, Board, Cell, PowerRarity, MovementsEnum };