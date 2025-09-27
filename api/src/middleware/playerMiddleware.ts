import { Request, Response, NextFunction } from "express";
import { CreatePlayer, DeletePlayer, GetPlayer } from "../utils/requests/playerRequests";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { PlayerResponses } from "../utils/responses/playerResponses";
import { PlayerService } from "../services/playerServices";
import { ServerResponses } from "../utils/responses/serverResponses";

export const PlayerMiddleware = {
    createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response, next: NextFunction) {
        const { player_id, nickname, avatar } = req.body;

        try {
            if (
                !player_id || 
                !nickname ||
                !avatar ||
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
            ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.GetPlayerFailed);

            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    deletePlayer(req: Request<DeletePlayer>, res: Response, next: NextFunction) {
        const { player_id } = req.params;

        try {
            if (
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.PlayerDeletedFailed);

            const player = PlayerService.getPlayer(player_id);

            if (
                player === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    }
}