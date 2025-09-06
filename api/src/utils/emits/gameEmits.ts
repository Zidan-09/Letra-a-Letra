import { Player } from "../../entities/player";

interface GameStarted {
    first: Player;
    words: string[];
}

export { GameStarted }