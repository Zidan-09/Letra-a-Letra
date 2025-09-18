import { Request, Response } from "express";
import { PlayerServices } from "../services/playerServices";
import { HandleResponse } from "../utils/server_utils/handleResponse";

export const PlayerController = {
    getPlayer(req: Request<{}, {}, { room_id: string, player_id: string }>, res: Response) {
        try {
            const { room_id, player_id } = req.body;

            const player = PlayerServices.getPlayer(room_id, player_id);

            if (player) return HandleResponse.serverResponse(res, 200, true, "player_founded", player);
            return HandleResponse.serverResponse(res, 404, false, "not_found");

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    } 
}