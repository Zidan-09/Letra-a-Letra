interface Game {
    room_id: string;
    room_name: string;
    status: GameStatus;
    players: Player[];
    spectators: Player[];
    created_by: string;
    timer: number;
    turn: number;
    board: Board | null;
    allowSpectators: boolean;
    privateRoom: boolean;
}

interface Player {
    player_id: string;
    nickname: string;
    spectator: boolean;
    powers: Power[];
    turn: 0 | 1;
    avatar: number;
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
    findedWords: string[];
    finded: number;
    grid: Cell[][];
    wordPositions: { [word: string]: [number, number][] };
}

interface Cell {
    letter?: string;
    position: { x: number; y: number};
    blocked: { status: boolean; blocked_by: string | null };
    trapped: { status: boolean, trapped_by: string | null };
    clicks?: number;
    revealed: boolean;
}

interface RoomSettings {
    theme: string;
    gamemode: string;
    allowedPowers: MovementsEnum[];
}

interface Power {
    power: MovementsEnum;
    rarity: PowerRarity
}

interface MoveEmit {
    status: GameResponses;
    cell?: { x: number, y: number };
    remaining?: number;
    letter?: string;
    completedWord?: { word: string, positions: [number, number][] };
    blocked_by?: string;
    trapped_by?: string;
    traps?: { x: number, y: number }[];
    player?: string;
    for?: string;
    power?: { hasPowerup: boolean, rarity?: PowerRarity, powerup?: MovementsEnum }
}

interface StartData {
    words: string[];
    room: {
            room_id: string,
            room_name: string,
            status: string,
            players: Player[],
            spectators: Player[],
            created_by: string,
            timer: number,
            turn: number,
            allowSpectators: boolean,
            privateRoom: boolean
        }
}

interface GameData {
    player_id: string;
    movement: MovementsEnum;
    powerIdx?: number;
    data: MoveEmit;
}

interface CompletedWord {
    finded_by: string;
    finded: string;
    positions: [number, number][]
}

type GameResponses = "revealed" | 
"almost_revealed" | 
"game_error" | 
"not_enough_players" | 
"game_started" | 
"continue" | 
"invalid_movement" |
"invalid_theme" |
"almost_blocked" |
"blocked" |
"unblocked" |
"trapped" |
"almost_trapped" |
"detected_traps" |
"spied" |
"frozen" |
"unfrozen" |
"player_frozen" |
"player_blind" |
"used_lantern" |
"player_immune";

export type GameModes = "NORMAL" | "CRAZY"

type PowerRarity = 
"COMMON" | 
"RARE" | 
"EPIC" | 
"LEGENDARY";

type MovementsEnum = 
"REVEAL" | 
"BLOCK" | 
"UNBLOCK" | 
"TRAP" | 
"DETECT_TRAPS" | 
"FREEZE" | 
"UNFREEZE" | 
"SPY" | 
"BLIND" | 
"LANTERN" | 
"IMMUNITY";

type GameStatus = 
"game_starting" | 
"game_running" | 
"game_over";

type CellKeys = `${number}-${number}`;

interface CellUpdate {
    x: number;
    y: number;
    letter?: string;
    power?: { hasPowerup: boolean, rarity?: PowerRarity, powerup?: MovementsEnum };
    blocked?: { blocked_by?: string, remaining?: number };
    trapped_by?: string;
    actor?: string;
    finded_by?: string;
}

export type {
    Game, 
    GameStatus, 
    Player, 
    PlayerEffect, 
    Board, 
    Cell, 
    PowerRarity, 
    MovementsEnum, 
    RoomSettings, 
    Power, 
    GameData, 
    MoveEmit, 
    StartData, 
    CompletedWord,
    CellKeys,
    CellUpdate
};