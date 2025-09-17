import { Request, Response } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { CreateRoom, JoinRoom, LeaveRoom, TurnPlayer, TurnSpectator } from "../utils/requests/roomRequests";
import { PlayerServices } from "../services/playerServices";
import { RoomService } from "../services/roomServices";
import { RoomResponses } from "../utils/responses/roomResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomController = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response) {
        try {
            const { socket_id, nickname, privateRoom }: CreateRoom = req.body;

            const player = PlayerServices.createPlayer(socket_id, nickname, false);

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
            const { socket_id, nickname, spectator, room_id } = req.body;

            const player = PlayerServices.createPlayer(socket_id, nickname, spectator);

            if (player) {
                const result = RoomService.joinRoom(room_id, player);

                return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomJoinned, result);
            }
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    joinAsSpectator(req: Request<{}, {}, JoinRoom>, res: Response) {
        try {
            const { socket_id, nickname, spectator, room_id } = req.body;

            const player = PlayerServices.createPlayer(socket_id, nickname, spectator);

            if (player) {
                const result = RoomService.joinAsSpectator(room_id, player);

                return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomJoinedAsSpectator, result);
            }
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    turnSpectatorToPlayer(req: Request<{}, {}, TurnPlayer>, res: Response) {
        try {
            const { socket_id, nickname, room_id } = req.body;

            const player = PlayerServices.createPlayer(socket_id, nickname, false);

            if (player) {
                const result = RoomService.turnSpectatorToPlayer(room_id, player);

                return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomTurnedToPlayer, result);
            }
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    turnPlayerToSpectator(req: Request<{}, {}, TurnSpectator>, res: Response) {
        try {
            const {room_id, player_id } = req.body;

            const player = PlayerServices.getPlayer(room_id, player_id);

            if (player != ServerResponses.NotFound) {
                const result = RoomService.turnPlayerToSpectator(room_id, player);

                return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomTurnedToSpectator, result);
            }
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    getRooms(req: Request, res: Response) {
        try {
           const rooms = RoomService.getPublicRooms();

           return HandleResponse.serverResponse(res, 200, true, RoomResponses.PublicRooms, rooms);
           
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