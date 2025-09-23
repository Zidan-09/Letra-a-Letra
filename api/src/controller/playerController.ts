import { Request, Response } from "express";
import { PlayerService } from "../services/playerServices";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { CreatePlayer, GetPlayer } from "../utils/requests/playerRequests";
import { ServerResponses } from "../utils/responses/serverResponses";
import { PlayerResponses } from "../utils/responses/playerResponses";

export const PlayerController = {
    createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response) {
        const { player_id, nickname } = req.body;

        try {
            const player = PlayerService.createPlayer(player_id, nickname, false);

            return HandleResponse.serverResponse(res, 200, true, PlayerResponses.PlayerCreated, player);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    getPlayer(req: Request<GetPlayer>, res: Response) {
        const { player_id } = req.params;

        try {
            const player = PlayerService.getPlayer(player_id);

            if (
                player !== ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 200, true, PlayerResponses.PlayerFounded, player);
            
            return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    } 
}