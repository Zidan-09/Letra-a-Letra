import { Request, Response } from 'express';
import { HandleResponse } from '../utils/server/handleResponse';
import { GameService } from '../services/gameService';
import { Movement, PassTurn, StartGame } from '../utils/requests/gameRequests';
import { GameResponses } from '../utils/responses/gameResponses';
import { ServerResponses } from '../utils/responses/serverResponses';
import { GameSocket } from '../utils/socket/gameSocket';
import { HandleSocket } from '../utils/server/handleSocket';
import { RoomParams } from '../utils/requests/roomRequests';
import { MovementsEnum } from '../utils/game/movementsEnum';

export const gameController = {
    startGame(req: Request<RoomParams, {}, StartGame>, res: Response) {
        const { room_id } = req.params;
        const { theme, gamemode, allowedPowers } = req.body;

        try {

            const result = GameService.startGame(room_id, theme, gamemode, allowedPowers);

            if (
                result === GameResponses.NotEnoughPlayers || 
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 400, false, result);
            
            GameSocket.gameStarted(room_id);

            return HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, ServerResponses.ServerError);
        }
    },

    moveGame(req: Request<RoomParams, {}, Movement>, res: Response) {
        const { room_id } = req.params;
        const { player_id, movement, powerIndex, x, y } = req.body;

        try {

            const result = GameService.moveGame(room_id, player_id, movement, powerIndex, x, y);

            if (
                typeof result !== "object"
            ) return HandleResponse.serverResponse(res, 400, false, result);

            HandleSocket(room_id, player_id, movement, result);
            GameSocket.gameOver(room_id);

            return HandleResponse.serverResponse(res, 200, true, result.status);

        } catch (err) {
            console.error(err);
            return HandleResponse.errorResponse(res, ServerResponses.ServerError)
        }
    },

    passTurn(req: Request<RoomParams, {}, PassTurn>, res: Response) {
        const { room_id } = req.params;
        const { player_id} = req.body;

        try {

            const result = GameService.passTurn(room_id, player_id);

            if (
                result === ServerResponses.NotFound 
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                result === GameResponses.GameError
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, ServerResponses.ServerError);
        }
    },

    passBecauseEffect(req: Request<RoomParams, {}, PassTurn>, res: Response) {
        const { room_id } = req.params;
        const { player_id } = req.body;

        try {
            
            const result = GameService.moveGame(room_id, player_id, MovementsEnum.FREEZE, 0);

            if (
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                result === GameResponses.GameError
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            if (
                result === GameResponses.PlayerFrozen
            ) {
                HandleSocket(room_id, player_id, MovementsEnum.FREEZE, { status: GameResponses.Frozen });
                return HandleResponse.serverResponse(res, 200, true, GameResponses.Frozen);
            }

            HandleResponse.serverResponse(res, 400, false, GameResponses.GameError, "FATAL");

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, ServerResponses.ServerError);
        }
    } 
}