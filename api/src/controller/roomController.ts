import { Request, Response } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { CreateRoom, GetRoom, JoinRoom, LeaveRoom } from "../utils/requests/roomRequests";
import { PlayerServices } from "../services/playerServices";
import { RoomService } from "../services/roomServices";
import { RoomResponses } from "../utils/responses/roomResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomController = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response) {
        try {
            const { socket_id, nickname, privateRoom }: CreateRoom = req.body;

            const player = PlayerServices.createPlayer(socket_id, nickname);

            if (player) {
                const room = RoomService.createRoom(player, privateRoom);
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
                const result = RoomService.joinRoom(data.room_id, player);

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

    getRooms(req: Request, res: Response) {
        try {
           const rooms = RoomService.getPublicRooms();

           HandleResponse.serverResponse(res, 200, true, RoomResponses.PublicRooms, rooms);
           
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    leaveRoom(req: Request<{}, {}, LeaveRoom>, res: Response) {
        try {
            const { room_id, player_id } = req.body;

            const result = RoomService.leaveRoom(room_id, player_id);

            if (result === ServerResponses.NotFound) return HandleResponse.serverResponse(
                res, 404, false, result
            )

            return HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }


    }
}