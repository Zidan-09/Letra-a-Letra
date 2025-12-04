import { MovementsEnum } from "../utils/game/movementsEnum";
import { Themes } from "../utils/board/themesEnum";
import { GameModes } from "../utils/game/gameModes";
import { GameStatus } from "../utils/game/gameStatus";
import { NullPlayer } from "../utils/game/nullPlayer";
import { Board } from "./board";
import { Player } from "./player";
export declare class Game {
    room_id: string;
    room_name: string;
    status: GameStatus;
    createdAt: number;
    timeout?: NodeJS.Timeout;
    players: Player[];
    spectators: Player[];
    bannedPlayerIds: string[];
    bannedPlayers: Player[];
    created_by: string;
    creator: string;
    turn: number;
    board: Board | null;
    allowSpectators: boolean;
    privateRoom: boolean;
    constructor(room_id: string, room_name: string, status: GameStatus, player: Player, allowSpectators: boolean, privateRoom: boolean);
    toJSON(): {
        room_id: string;
        room_name: string;
        status: GameStatus;
        createdAt: number;
        players: Player[];
        spectators: Player[];
        bannedPlayerIds: string[];
        bannedPlayers: Player[];
        created_by: string;
        creator: string;
        turn: number;
        board: Board | null;
        allowSpectators: boolean;
        privateRoom: boolean;
    };
    startGame(theme: Themes, gamemode: GameModes, allowedPowers: MovementsEnum[]): void;
    setStatus(status: GameStatus): void;
    incrementTurn(): void;
    gameOver(): Player | NullPlayer | false;
}
//# sourceMappingURL=game.d.ts.map