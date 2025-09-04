import { Request, Response } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { CreateRoom, JoinRoom } from "../utils/requests/roomRequests";
import { PlayerServices } from "../services/playerServices";
import { roomService } from "../services/roomServices";
import { RoomResponses } from "../utils/responses/roomResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomController = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response) {
        try {
            const data: CreateRoom = req.body;

            const player = PlayerServices.createPlayer(data.socket_id, data.nickname);

            if (player) {
                const room = roomService.createRoom(player);
                if (room) {
                    return HandleResponse.serverResponse(res, 201, true, RoomResponses.RoomCreated, room)
                }
            }

            return HandleResponse.serverResponse(res, 400, false, RoomResponses.RoomCreateonFailed);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    joinRoom(req: Request<{}, {}, JoinRoom>, res: Response) {
        try {
            const data: JoinRoom = req.body;

            const player = PlayerServices.createPlayer(data.socket_id, data.nickname);

            if (player) {
                const result = roomService.joinRoom(data.room_id, player);

                if (result !== ServerResponses.NotFound) {
                    return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomJoinned, result);
                }

                return HandleResponse.serverResponse(res, 404, false, result);
            }
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    getRoom(req: Request, res: Response) {

    },

    leaveRoom(req: Request, res: Response) {

    }
}