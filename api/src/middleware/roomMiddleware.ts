import { Request, Response, NextFunction } from "express"
import { CreateRoom, JoinRoom, LeaveRoom } from "../utils/requests/roomRequests";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { RoomResponses } from "../utils/responses/roomResponses";
import { RoomService } from "../services/roomServices";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomMiddleware = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response, next: NextFunction) {
        try {
            const { socket_id, nickname, privateRoom } = req.body;

            if (!socket_id || !nickname || !privateRoom) return (
                HandleResponse.serverResponse(res, 400, false, RoomResponses.RoomCreateonFailed)
            );

            next();
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err)
        }
    },

    joinRoom(req: Request<{}, {}, JoinRoom>, res: Response, next: NextFunction) {
        try {
            const { socket_id, nickname, room_id } = req.body;

            if (!socket_id || !nickname || !room_id) return HandleResponse.serverResponse(res, 400, false, RoomResponses.DataError);
            const game = RoomService.getRoom(room_id);

            if (!game) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);
            if (game.players.length >= 2) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    leftRoom(req: Request<{}, {}, LeaveRoom>, res: Response, next: NextFunction) {
        try {
            const { room_id, player_id } = req.body;

            if (!room_id || !player_id) return HandleResponse.serverResponse(res, 400, false, RoomResponses.DataError);
            const game = RoomService.getRoom(room_id);

            if (!game || !game.players.find(p => p.player_id === player_id)) return (
                HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound
            ));

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    }
}