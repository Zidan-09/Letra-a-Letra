import { Request, Response } from "express";
import { CreatePlayer } from "../requests/playerRequests";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { PlayerServices } from "../services/playerServices";
import { PlayerResponses } from "../utils/responses/playerResponses";

export const PlayerController = {

    async createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response) {
        try {
            const { nickname }: CreatePlayer = req.body;

            const player = PlayerServices.createPlayer(nickname);

            if (player != undefined) {
                return HandleResponse.serverResponse(res, 201, true, PlayerResponses.PlayerCreated, player);
            }
            
            return HandleResponse.serverResponse(res, 400, false, PlayerResponses.PlayerCreationFailed);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    async getPlayer(req: Request, res: Response) {
        
    }
}