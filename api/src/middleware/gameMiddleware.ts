import { Request, Response, NextFunction } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { Movement, PassTurn, StartGame } from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { RoomService } from "../services/roomServices";
import { ServerResponses } from "../utils/responses/serverResponses";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { MovementsEnum } from "../utils/board_utils/movementsEnum";

export const GameMiddleware = {
    startGame(req: Request<{}, {}, StartGame>, res: Response, next: NextFunction) {
        try {
            const { room_id, theme } = req.body;

            if (!room_id || !theme) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);
            const game = RoomService.getRoom(room_id);

            if (!game || game.status !== GameStatus.GameStarting) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    validateMovement(req: Request<{}, {}, Movement>, res: Response, next: NextFunction) {
        try {
            const { room_id, player_id, movement } = req.body;
    
            const game = RoomService.getRoom(room_id);
            if (!game) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);
            const players = game.players;
            if (!players?.length) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);
            const board = game.board;
    
            if (game.status !== GameStatus.GameRunning) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);
    
            const player = players.find(p =>
                p.player_id === player_id
            );

            if (!player || game.turn % 2 !== player.turn || !board || player.spectator) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            const movements = Object.values(MovementsEnum);
    
            if (!movements.includes(movement)) return HandleResponse.serverResponse(res, 400, false, GameResponses.InvalidMovement);
    
            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    passTurn(req: Request<{}, {}, PassTurn>, res: Response, next: NextFunction) {
        try {
            const { room_id, player_id } = req.body;

            if (!room_id || !player_id) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            const game = RoomService.getRoom(room_id);
            if (!game) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);
            const players = game.players;
            if (!players) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);

            const player = players.find(p => 
                p.player_id === player_id
            );

            if (!player || game.turn % 2 !== player.turn) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    }
}