import { Request, Response } from 'express';
import { HandleResponse } from '../utils/server_utils/handleResponse';
import { GameService } from '../services/gameServices';

export const gameController = {
    async revealLetter(req: Request<{}, {}, any>, res: Response) {
        try {
            const gameReq = req.body;

            const result = GameService.revealLetter(gameReq);

        } catch (err) {
            console.error(err);
            return HandleResponse.errorResponse(res, err)
        }
    }
}