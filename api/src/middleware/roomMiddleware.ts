import { Request, Response, NextFunction } from "express"
import { CreateRoom, JoinRoom, LeaveRoom } from "../utils/requests/roomRequests";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { RoomResponses } from "../utils/responses/roomResponses";
import { RoomService } from "../services/roomServices";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomMiddleware = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response, next: NextFunction) {
        try {
            const { room_name, allowedPowers, gameMode, spectators, privateRoom, player_id } = req.body;

            if (
                !room_name ||
                room_name.length > 10 ||
                !allowedPowers || 
                !gameMode || 
                spectators === undefined || 
                privateRoom === undefined || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.RoomCreateonFailed);

            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err)
        }
    },

    joinRoom(req: Request<{}, {}, JoinRoom>, res: Response, next: NextFunction) {
        try {
            const { room_id, spectator, player_id } = req.body;

            if (
                !room_id || 
                spectator === undefined || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.DataError);

            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                game.players.length >= 2 && 
                !spectator
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);

            if (
                !game.haveSpectators && spectator
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.SpectatorsOff); 

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    leftRoom(req: Request<{}, {}, LeaveRoom>, res: Response, next: NextFunction) {
        try {
            const { room_id, player_id } = req.body;

            if (
                !room_id || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.DataError);

            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound || 
                !game.players.find(p => p.player_id === player_id)
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    }
}