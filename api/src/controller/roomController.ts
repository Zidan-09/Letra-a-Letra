import { Request, Response } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { ChangeRoomSettigns, CreateRoom, JoinRoom, LeaveRoom, TurnPlayer, TurnSpectator } from "../utils/requests/roomRequests";
import { RoomService } from "../services/roomServices";
import { RoomResponses } from "../utils/responses/roomResponses";
import { ServerResponses } from "../utils/responses/serverResponses";

export const RoomController = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response) {
        const { room_name, allowedPowers, gameMode, spectators, privateRoom, player_id }: CreateRoom = req.body;

        try {
            const room = RoomService.createRoom(room_name, allowedPowers, gameMode, spectators, privateRoom, player_id);
            
            if (
                room
            ) return HandleResponse.serverResponse(res, 201, true, RoomResponses.RoomCreated, room)
            

            return HandleResponse.serverResponse(res, 400, false, RoomResponses.RoomCreateonFailed);

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    joinRoom(req: Request<{}, {}, JoinRoom>, res: Response) {
        const { room_id, spectator, player_id } = req.body;

        try {
            const result = RoomService.joinRoom(room_id, player_id, spectator);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomJoinned, result);
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    turnSpectatorToPlayer(req: Request<{}, {}, TurnPlayer>, res: Response) {
        const { room_id, player_id } = req.body;

        try {
            const result = RoomService.turnSpectatorToPlayer(room_id, player_id);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomTurnedToPlayer, result);
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    turnPlayerToSpectator(req: Request<{}, {}, TurnSpectator>, res: Response) {
        const { room_id, player_id } = req.body;

        try {
            const result = RoomService.turnPlayerToSpectator(room_id, player_id);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomTurnedToSpectator, result);
            
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
        const { room_id, player_id } = req.body;

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

    changeRoomSettings(req: Request<{}, {}, ChangeRoomSettigns>, res: Response) {
        const { room_id, allowedPowers, gameMode } = req.body;

        try {
            const result = RoomService.changeRoomSettings(room_id, allowedPowers, gameMode);

            if (
                result === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            return HandleResponse.serverResponse(res, 200, true, RoomResponses.RoomSettingsChanged, result);

        } catch (err) {
            console.error(err);
        }
    }
}