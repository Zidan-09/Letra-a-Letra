import { MovementsEnum } from "../utils/game/movementsEnum";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { GameModes } from "../utils/game/gameModes";
import { Themes } from "../utils/board/themesEnum";
import { MoveEmit } from "../utils/socket/gameEmits";
export declare const GameService: {
    startGame(room_id: string, theme: Themes, gamemode: GameModes, allowedPowers: MovementsEnum[]): ServerResponses.NotFound | GameResponses.NotEnoughPlayers | GameResponses.GameStarted;
    passTurn(room_id: string, player_id: string): ServerResponses.NotFound | ServerResponses.Ended | GameResponses.GameError | GameResponses.Continue;
    passTurnEffect(room_id: string, player_id: string): ServerResponses.NotFound | GameResponses.GameError | undefined;
    discardPower(room_id: string, player_id: string, powerIdx: number): ServerResponses.NotFound | import("../entities/game").Game;
    moveGame(room_id: string, player_id: string, movement: MovementsEnum, powerIndex: number | undefined, x?: number, y?: number): ServerResponses.NotFound | GameResponses | MoveEmit;
};
//# sourceMappingURL=gameService.d.ts.map