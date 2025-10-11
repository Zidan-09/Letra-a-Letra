import { Request, Response, NextFunction } from "express";
import { HandleResponse } from "../utils/server_utils/handleResponse";
import { Movement, PassTurn, StartGame } from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { RoomService } from "../services/roomServices";
import { ServerResponses } from "../utils/responses/serverResponses";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { MovementsEnum } from "../utils/board_utils/movementsEnum";
import { Themes } from "../utils/board_utils/themesEnum";
import { RoomParams } from "../utils/requests/roomRequests";
import { GameModes } from "../utils/game_utils/gameModes";
import { PowerRarity } from "../utils/cell_utils/powerRarity";

export const GameMiddleware = {
    startGame(req: Request<RoomParams, {}, StartGame>, res: Response, next: NextFunction) {
        const { room_id } = req.params;
        const { theme, gamemode, allowedPowers } = req.body;

        try {
            if (
                !room_id ||
                !theme ||
                !gamemode ||
                !allowedPowers
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            const game = RoomService.getRoom(room_id);

            if (
                game == ServerResponses.NotFound || 
                game.status === GameStatus.GameRunning
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            if (
                !Object.values(Themes).includes(theme)
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.InvalidTheme);

            const powers = Object.values(MovementsEnum);

            if (
                allowedPowers.some(power => !powers.includes(power))
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            const gameModes = Object.values(GameModes);

            if (
                !gameModes.includes(gamemode)
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    validateMovement(req: Request<RoomParams, {}, Movement>, res: Response, next: NextFunction) {
        const { room_id } = req.params;
        const { player_id, movement, powerIndex } = req.body;

        try {
            if (
                !room_id ||
                !player_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);
    
            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);

            const players = game.players;

            if (
                !players?.length
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);

            const board = game.board;
    
            if (
                game.status !== GameStatus.GameRunning
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);
    
            const player = players.filter(Boolean).find(p =>
                p.player_id === player_id
            );

            if (
                !player ||  
                !board || player.spectator
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            if (
                game.turn % 2 !== player.turn
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.InvalidTurnAction);

            const movements = Object.values(MovementsEnum);
    
            if (
                !movements.includes(movement)
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.InvalidMovement);

            if (
                powerIndex !== undefined && 0 > powerIndex || 
                powerIndex !== undefined && powerIndex > 5 ||
                powerIndex !== undefined && player.powers[powerIndex]?.power !== movement
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.InvalidMovement);

            if (
                powerIndex !== undefined && 
                player.powers[powerIndex]?.power && 
                player.powers[powerIndex].power !== movement
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.WithoutPower);
            
            next();
            
        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    passTurn(req: Request<RoomParams, {}, PassTurn>, res: Response, next: NextFunction) {
        const { room_id } = req.params;
        const { player_id } = req.body;

        try {

            if (
                !room_id || !player_id
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

            const game = RoomService.getRoom(room_id);

            if (
                game === ServerResponses.NotFound
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);

            const players = game.players;

            if (
                !players
            ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.NotFound);

            const player = players.filter(Boolean).find(p => 
                p.player_id === player_id
            );

            if (
                !player || 
                game.turn % 2 !== player.turn
            ) return HandleResponse.serverResponse(res, 400, false, GameResponses.GameError);

            next();

        } catch (err) {
            console.error(err);
            HandleResponse.errorResponse(res, err);
        }
    },

    passBecauseEffect(req: Request<RoomParams, {}, PassTurn>, res: Response, next: NextFunction) {
        const { room_id } = req.params;
        const { player_id } = req.body;

        if (
            !room_id ||
            !player_id
        ) return HandleResponse.serverResponse(res, 400, false, ServerResponses.MissingData);

        const room = RoomService.getRoom(room_id);

        if (
            room === ServerResponses.NotFound
        ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

        const player = room.players.filter(Boolean).find(p => p.player_id === player_id);

        if (
            !player
        ) return HandleResponse.serverResponse(res, 404, false, ServerResponses.NotFound);

        if (
            player.freeze.active &&
            player.powers.includes({ power: MovementsEnum.IMMUNITY, rarity: PowerRarity.LEGENDARY, type: "effect" }) ||
            player.freeze.active &&
            player.powers.includes({ power: MovementsEnum.UNFREEZE, rarity: PowerRarity.RARE, type: "effect" })
        ) return HandleResponse.serverResponse(res, 400, false, GameResponses.InvalidMovement);

        next();
    }
}