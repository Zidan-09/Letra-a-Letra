import { Request, Response, NextFunction } from "express"
import { CreateRoom, JoinRoom, LeaveRoom, ChangeRole, RoomParams, ActionParams } from "../utils/requests/roomRequests";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { RoomResponses } from "../utils/responses/roomResponses";
import { RoomService } from "../services/roomServices";
import { ServerResponses } from "../utils/responses/serverResponses";
import { PlayerResponses } from "../utils/responses/playerResponses";

export const RoomMiddleware = {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response, next: NextFunction) {
        try {
            const { room_name, timer, allowSpectators, privateRoom, player_id } = req.body;

            if (
                !room_name ||
                !timer ||
                room_name.length > 10 ||
                allowSpectators === undefined || 
                privateRoom === undefined || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err)
        }
    },

    joinRoom(req: Request<RoomParams, {}, JoinRoom>, res: Response, next: NextFunction) {
        const { room_id } = req.params;
        const { spectator, player_id } = req.body;

        try {

            if (
                !room_id || 
                spectator === undefined || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                game.players.length >= 2 && 
                !spectator
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);

            if (
                !game.allowSpectators && spectator
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.SpectatorsOff); 

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    changeRole(req: Request<ActionParams, {}, ChangeRole>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;
        const { role } = req.body;

        try {
            if (
                !room_id || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                role === "spectator"
            ) {
                const target = game.spectators.find(spectator => 
                    spectator.player_id === player_id
                );

                if (
                    !target
                ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

                if (
                    target.spectator
                ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.AlreadySpectator);

                if (
                    game.players.length >= 2
                ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);
            }

            if (
                role === "player"
            ) {
                const target = game.players.find(player => 
                    player.player_id === player_id
                );

                if (
                    !target
                ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

                if (
                    !target.spectator
                ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.AlreadyPlayer);
            }

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    getRoom(req: Request<RoomParams>, res: Response, next: NextFunction) {
        const { room_id } = req.params;

        try {
            if (
                !room_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    leftRoom(req: Request<ActionParams, {}, LeaveRoom>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;

        try {

            if (
                !room_id || 
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

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
    },
}