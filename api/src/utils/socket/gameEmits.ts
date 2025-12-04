import { Player } from "../../entities/player";
import { MovementsEnum } from "../game/movementsEnum";
import { PowerRarity } from "../cell/powerRarity";
import { GameStatus } from "../game/gameStatus";
import { GameResponses } from "../responses/gameResponses";

interface GameData {
  room_id: string;
  room_name: string;
  status: GameStatus;
  players: Player[];
  spectators: Player[];
  created_by: string;
  creator: string;
  turn: number;
  allowSpectators: boolean;
  privateRoom: boolean;
}

interface GameStarted {
  words: string[];
  room: GameData;
}

interface MoveEmit {
  status: GameResponses;
  cell?: { x: number; y: number };
  remaining?: number;
  letter?: string;
  completedWord?: { word: string; positions: [number, number][] };
  blocked_by?: string;
  trapped_by?: string | undefined | null;
  traps?: { x: number; y: number }[];
  player?: string;
  for?: string;
  power?: {
    hasPowerup: boolean;
    rarity?: PowerRarity;
    powerup?: MovementsEnum | null;
  };
}

export { GameStarted, MoveEmit };
