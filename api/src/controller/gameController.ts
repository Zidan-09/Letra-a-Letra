import { Request, Response } from 'express';
import { HandleResponse } from '../utils/server_utils/handleResponse';
import { GameService } from '../services/gameServices';
import { Movement, PassTurn, StartGame } from '../utils/requests/gameRequests';
import { GameResponses } from '../utils/responses/gameResponses';
import { ServerResponses } from '../utils/responses/serverResponses';
import { SendSocket } from '../utils/game_utils/sendSocket';
import { HandleSocket } from '../utils/server_utils/handleSocket';
import { RoomParams } from '../utils/requests/roomRequests';

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
            
            SendSocket.gameStarted(room_id);

            return HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    moveGame(req: Request<RoomParams, {}, Movement>, res: Response) {
        const { room_id } = req.params;
        const { player_id, movement, x, y } = req.body;

        try {

            const result = GameService.moveGame(room_id, player_id, movement, x, y);

            if (
                typeof result !== "object"
            ) return HandleResponse.serverResponse(res, 400, false, result);

            HandleSocket(room_id, player_id, movement, result);
            SendSocket.gameOver(room_id);

            return HandleResponse.serverResponse(res, 200, true, result.status);

        } catch (err) {
            console.error(err);
            return HandleResponse.errorResponse(res, err)
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
            HandleResponse.errorResponse(res, err);
        }
    }
}