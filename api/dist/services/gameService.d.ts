import { MovementsEnum } from "../utils/game/movementsEnum";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { GameModes } from "../utils/game/gameModes";
import { Themes } from "../utils/board/themesEnum";
import { MoveEmit } from "../utils/socket/gameEmits";
export declare const GameService: {
    startGame(room_id: string, theme: Themes, gamemode: GameModes, allowedPowers: MovementsEnum[]): ServerResponses.NOT_FOUND | GameResponses.NOT_ENOUGH_PLAYERS | GameResponses.GAME_STARTED;
    passTurn(room_id: string, player_id: string): ServerResponses.NOT_FOUND | ServerResponses.ENDED | GameResponses.GAME_ERROR | GameResponses.CONTINUE;
    passTurnEffect(room_id: string, player_id: string): ServerResponses.NOT_FOUND | GameResponses.GAME_ERROR | undefined;
    discardPower(room_id: string, player_id: string, powerIdx: number): ServerResponses.NOT_FOUND | import("../entities/game").Game;
    moveGame(room_id: string, player_id: string, movement: MovementsEnum, powerIndex: number | undefined, x?: number, y?: number): ServerResponses.NOT_FOUND | GameResponses | MoveEmit;
};
//# sourceMappingURL=gameService.d.ts.map