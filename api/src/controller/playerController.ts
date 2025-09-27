import { Request, Response } from "express";
import { PlayerService } from "../services/playerServices";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { CreatePlayer, DeletePlayer, GetPlayer } from "../utils/requests/playerRequests";
import { ServerResponses } from "../utils/responses/serverResponses";
import { PlayerResponses } from "../utils/responses/playerResponses";

export const PlayerController = {
    createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response) {
        const { player_id, nickname, avatar } = req.body;

        try {
            const player = PlayerService.createPlayer(player_id, nickname, false, avatar);

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
            ) return HandleResponse.serverResponse(res, 200, true, PlayerResponses.PlayerFound, player);
            
            return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    getAllPlayers(req: Request, res: Response) {
        try {
            const players = PlayerService.getAll();
    
            return HandleResponse.serverResponse(res, 200, true, PlayerResponses.AllPlayers, players);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    deletePlayer(req: Request<DeletePlayer>, res: Response) {
        const { player_id } = req.params;

        try {
            const result = PlayerService.removePlayer(player_id);

            if (result) return HandleResponse.serverResponse(res, 200, true, PlayerResponses.PlayerDeleted);

            HandleResponse.serverResponse(res, 400, false, PlayerResponses.PlayerDeletedFailed);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    }
}