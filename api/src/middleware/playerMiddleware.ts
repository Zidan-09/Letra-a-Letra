import { Request, Response, NextFunction } from "express";
import { CreatePlayer, GetPlayer } from "../utils/requests/playerRequests";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { PlayerResponses } from "../utils/responses/playerResponses";

export const PlayerMiddleware = {
    createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response, next: NextFunction) {
        const { player_id, nickname } = req.body;

        try {
            if (
                !player_id || 
                !nickname ||
                nickname.length > 10
            ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.PlayerCreationFailed);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    getPlayer(req: Request<GetPlayer>, res: Response, next: NextFunction) {
        const { player_id } = req.params;

        try {
            if (
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.GetPlayerFailed);7

            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },
}