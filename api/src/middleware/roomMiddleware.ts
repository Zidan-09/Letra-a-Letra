import { Request, Response, NextFunction } from "express"
import { CreateRoom, JoinRoom, LeaveRoom, ChangeRole, RoomParams, ActionParams, RemovePlayer } from "../utils/requests/roomRequests";
import { HandleResponse } from "../utils/server/handleResponse";
import { RoomResponses } from "../utils/responses/roomResponses";
import { RoomService } from "../services/roomService";
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
            HandleResponse.errorResponse(res)
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
                (!spectator && game.players.every(p => p)) ||
                (spectator && game.spectators.every(s => s))
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);

            if (
                !game.allowSpectators && spectator
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.SpectatorsOff);

            if (
                game.bannedPlayerIds.includes(player_id)
            ) return HandleResponse.serverResponse(res, 403, false, RoomResponses.BannedPlayer);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    },

    changeRole(req: Request<ActionParams, {}, ChangeRole>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;
        const { role, index } = req.body;

        try {
            if (
                !room_id || 
                !player_id ||
                !role ||
                index === undefined
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            const game = RoomService.getRoom(room_id);
            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);
            if (
                role === "spectator"
            ) {
                const target = game.players.filter(Boolean).find(p => p.player_id === player_id)
                        || game.spectators.filter(Boolean).find(s => s.player_id === player_id);

                if (
                    !target
                ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

                if (
                    index < 0 || index >= game.spectators.length
                ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.InvalidSlot);

                if (
                    target.spectator && game.spectators[index]?.player_id === player_id
                ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.AlreadySpectator);
            }

            if (
                role === "player"
            ) {
                const target = game.players.filter(Boolean).find(p => p.player_id === player_id)
                        || game.spectators.filter(Boolean).find(s => s.player_id === player_id);

                if (
                    !target
                ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

                if (
                    index < 0 || index >= game.players.length
                ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.InvalidSlot);

                if (
                    !target.spectator && game.players[index]?.player_id === player_id
                ) return HandleResponse.serverResponse(res, 400, false, PlayerResponses.AlreadyPlayer);


                if (
                    game.players[index] && game.players[index].player_id !== player_id
                ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.FullRoom);
            }

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
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
            HandleResponse.errorResponse(res);
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
                ![...game.players, ...game.spectators].filter(Boolean).find(p => p.player_id === player_id)
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    },

    removePlayer(req: Request<ActionParams, {}, RemovePlayer>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;
        const { banned } = req.body;

        try {
            if (
                !room_id ||
                !player_id ||
                banned === undefined
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            const player = [...game.players, ...game.spectators].filter(Boolean).find(p => p.player_id === player_id);

            if (!player) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

            if (
                player.player_id === game.created_by
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.DataError);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res)
        }
    },

    unbanPlayer(req: Request<ActionParams>, res: Response, next: NextFunction) {
        const { room_id, player_id } = req.params;

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
                !game.bannedPlayerIds.includes(player_id)
            ) return HandleResponse.serverResponse(res, 400, false, RoomResponses.BannedPlayerNotFound);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res);
        }
    }
}