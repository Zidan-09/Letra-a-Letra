import { Request, Response } from "express";
import { PlayerServices } from "../services/playerServices";
import { HandleResponse } from "../utils/server_utils/handleResponse";

export const PlayerController = {
    getPlayer(req: Request<string>, res: Response) {
        try {
            const player_id = req.params;

            const player = PlayerServices.getPlayer(player_id);

            if (player) return HandleResponse.serverResponse(res, 200, true, "player_founded", player);
            return HandleResponse.serverResponse(res, 404, false, "not_found");

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    } 
}