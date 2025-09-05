import { Request, Response } from 'express';
import { HandleResponse } from '../utils/server_utils/handleResponse';
import { GameService } from '../services/gameServices';
import { RevealLetter, StartGame } from '../utils/requests/gameRequests';
import { GameResponses } from '../utils/responses/gameResponses';
import { ServerResponses } from '../utils/responses/serverResponses';
import { SendSocket } from '../utils/game_utils/sendSocket';

export const gameController = {
    startGame(req: Request<StartGame>, res: Response) {
        try {
            const { room_id } = req.params;

            const result = GameService.startGame(room_id);

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

    revealLetter(req: Request<{}, {}, RevealLetter>, res: Response) {
        try {
            const data = req.body;

            const result = GameService.revealLetter(data);

            if (result === (GameResponses.GameError || ServerResponses.NotFound)) return (
                HandleResponse.serverResponse(res, 400, false, result)
            );

            SendSocket.letterRevealed(data.room_id, data.x, data.y, result);

            return HandleResponse.serverResponse(res, 200, true, GameResponses.Revealed);

        } catch (err) {
            console.error(err);
            return HandleResponse.errorResponse(res, err)
        }
    }
}