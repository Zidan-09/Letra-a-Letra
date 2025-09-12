import { Request, Response, text } from 'express';
import { HandleResponse } from '../utils/server_utils/handleResponse';
import { GameService } from '../services/gameServices';
import { Movement, PassTurn, StartGame } from '../utils/requests/gameRequests';
import { GameResponses } from '../utils/responses/gameResponses';
import { ServerResponses } from '../utils/responses/serverResponses';
import { SendSocket } from '../utils/game_utils/sendSocket';
import { HandleSocket } from '../utils/server_utils/handleSocket';

export const gameController = {
    startGame(req: Request<{}, {}, StartGame>, res: Response) {
        try {
            const { room_id, theme } = req.body;

            const result = GameService.startGame(room_id, theme);

            if (result === (GameResponses.NotEnoughPlayers || ServerResponses.NotFound)) return (
                HandleResponse.serverResponse(res, 400, false, result)
            );
            
            SendSocket.gameStarted(room_id);

            return HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    moveGame(req: Request<{}, {}, Movement>, res: Response) {
        try {
            const { room_id, player_id, movement, x, y } = req.body;

            const result = GameService.moveGame(room_id, player_id, movement, x, y);

            if (typeof result === "string") return (
                HandleResponse.serverResponse(res, 400, false, result)
            );

            HandleSocket(room_id, player_id, movement, result)

            return HandleResponse.serverResponse(res, 200, true, result.status);

        } catch (err) {
            console.error(err);
            return HandleResponse.errorResponse(res, err)
        }
    },

    passTurn(req: Request<{}, {}, PassTurn>, res: Response) {
        try {
            const { room_id, player_id} = req.body;

            const result = GameService.passTurn(room_id, player_id);

            if (result === ServerResponses.NotFound) return HandleResponse.serverResponse(res, 404, false, result);
            if (result === GameResponses.GameError) return HandleResponse.serverResponse(res, 400, false, result);

            HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    }
}