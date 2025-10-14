import { NextFunction, Request, Response } from "express";
import { HandleResponse } from "../utils/server/handleResponse";
import { ActionParams, ChangeRole, CreateRoom, JoinRoom, RemovePlayer, RoomParams } from "../utils/requests/roomRequests";
import { RoomService } from "../services/roomService";
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
            HandleResponse.errorResponse(res);
        }
    },

    joinRoom(req: Request<RoomParams, {}, JoinRoom>, res: Response) {
        const { room_id } = req.params;
        const { spectator, player_id } = req.body;

        try {
            const result = RoomService.joinRoom(room_id, player_id, spectator);

            if (
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomJoined, result);
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    },

    changeRole(req: Request<ActionParams, {}, ChangeRole>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;
        const { role, index } = req.body;

        try {
            const result = RoomService.changeRole(room_id, player_id, role, index);

            if (
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                result === RoomResponses.FullRoom
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoleChanged);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    },

    getRooms(req: Request, res: Response) {
        try {
           const rooms = RoomService.getPublicRooms();

           return HandleResponse.serverResponse(res, 200, true, RoomResponses.PublicRooms, rooms);
           
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
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
            HandleResponse.errorResponse(res);
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
            HandleResponse.errorResponse(res);
        }
    },

    removePlayer(req: Request<ActionParams, {}, RemovePlayer>, res: Response) {
        const { room_id, player_id } = req.params;
        const { banned } = req.body;

        try {
            const result = RoomService.removePlayer(room_id, player_id, banned);

            if (
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RemovedPlayer, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    },

    unbanPlayer(req: Request<ActionParams>, res: Response) {
        const { room_id, player_id } = req.params;

        try {
            const result = RoomService.unbanPlayer(room_id, player_id);

            if (
                result === ServerResponses.NotFound ||
                result === RoomResponses.BannedPlayerNotFound
            ) return HandleResponse.serverResponse(res, 404, false, result);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.PlayerUbanned, result);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    }

}