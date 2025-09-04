import { Request, Response } from "express";
import { PlayerServices } from "../services/playerServices";
import { HandleResponse } from "../utils/server_utils/handleResponse";

export const PlayerController = {
    getPlayer(req: Request<string>, res: Response) {
        try {
            const id = req.params;

            const player = PlayerServices.getPlayer(id);

            return HandleResponse.serverResponse(res, 200, true, "player_founded", player);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    } 
}