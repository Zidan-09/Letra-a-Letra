import { NextFunction, Request, Response } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { ActionParams, ChangeRole, CreateRoom, JoinRoom, RoomParams } from "../utils/requests/roomRequests";
import { RoomService } from "../services/roomServices";
import { RoomResponses } from "../utils/responses/roomResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomController = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response) {
        const { room_name, timer, allowSpectators, privateRoom, player_id }: CreateRoom = req.body;

        try {
            const room = RoomService.createRoom(room_name, timer, allowSpectators, privateRoom, player_id);
            
            if (
                room
            ) return HandleResponse.serverResponse(res, 201, true, RoomResponses.RoomCreated, room)
            

            return HandleResponse.serverResponse(res, 400, false, RoomResponses.RoomCreationFailed);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    joinRoom(req: Request<RoomParams, {}, JoinRoom>, res: Response) {
        const { room_id } = req.params;
        const { spectator, player_id } = req.body;

        try {
            const result = RoomService.joinRoom(room_id, player_id, spectator);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomJoined, result);
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    changeRole(req: Request<ActionParams, {}, ChangeRole>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;
        const { role } = req.body;

        try {
            if (role === "player") {
                const result = RoomService.turnSpectatorToPlayer(room_id, player_id);

                if (
                    result === ServerResponses.NotFound
                ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

                return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomTurnedToPlayer);

            } else if (role === "spectator") {
                const result = RoomService.turnPlayerToSpectator(room_id, player_id);

                if (
                    result === ServerResponses.NotFound
                ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

                return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomTurnedToSpectator);
            }

            return HandleResponse.serverResponse(res, 400, false, RoomResponses.DataError);

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

    getRoom(req: Request<RoomParams>, res: Response) {
        const { room_id } = req.params;

        try {
            const room = RoomService.getRoom(room_id);

            if (
                room === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomFound, room);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    leaveRoom(req: Request<ActionParams, {}, {}>, res: Response) {
        const { room_id, player_id } = req.params;

        try {
            const result = RoomService.leaveRoom(room_id, player_id);

            if (
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, result);

            return HandleResponse.serverResponse(res, 200, true, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },
}