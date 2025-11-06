import { Request, Response } from "express";
import { HandleResponse } from "../utils/server/handleResponse";
import { GameService } from "../services/gameService";
import {
  DiscardPower,
  Movement,
  PassTurn,
  StartGame,
} from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { GameSocket } from "../utils/socket/gameSocket";
import { HandleSocket } from "../utils/server/handleSocket";
import { ActionParams, RoomParams } from "../utils/requests/roomRequests";
import { MovementsEnum } from "../utils/game/movementsEnum";

export const gameController = {
  startGame(req: Request<RoomParams, {}, StartGame>, res: Response) {
    const { room_id } = req.params;
    const { theme, gamemode, allowedPowers } = req.body;

    try {
      const result = GameService.startGame(
        room_id,
        theme,
        gamemode,
        allowedPowers
      );

      if (
        result === GameResponses.NOT_ENOUGH_PLAYERS ||
        result === ServerResponses.NOT_FOUND
      )
        return HandleResponse.serverResponse(res, 400, false, result);

      GameSocket.gameStarted(room_id);

      return HandleResponse.serverResponse(res, 200, true, result);
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  moveGame(req: Request<RoomParams, {}, Movement>, res: Response) {
    const { room_id } = req.params;
    const { player_id, movement, powerIndex, x, y } = req.body;

    try {
      const result = GameService.moveGame(
        room_id,
        player_id,
        movement,
        powerIndex,
        x,
        y
      );

      if (typeof result !== "object") {
        if (
          result === GameResponses.IMMUNITY &&
          movement !== MovementsEnum.IMMUNITY
        ) {
          return HandleResponse.serverResponse(
            res,
            200,
            true,
            GameResponses.IMMUNITY,
            movement
          );
        }
        return HandleResponse.serverResponse(res, 400, false, result);
      }

      HandleSocket(room_id, player_id, movement, result);
      GameSocket.gameOver(room_id);

      return HandleResponse.serverResponse(res, 200, true, result.status);
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  passTurn(req: Request<RoomParams, {}, PassTurn>, res: Response) {
    const { room_id } = req.params;
    const { player_id } = req.body;

    try {
      const result = GameService.passTurn(room_id, player_id);

      if (result === ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          404,
          false,
          ServerResponses.NOT_FOUND
        );

      if (result === GameResponses.GAME_ERROR)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      HandleResponse.serverResponse(res, 200, true, result);
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  passBecauseEffect(req: Request<RoomParams, {}, PassTurn>, res: Response) {
    const { room_id } = req.params;
    const { player_id } = req.body;

    try {
      const result = GameService.moveGame(
        room_id,
        player_id,
        MovementsEnum.FREEZE,
        0
      );

      if (result === ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          404,
          false,
          ServerResponses.NOT_FOUND
        );

      if (result === GameResponses.GAME_ERROR)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      if (result === GameResponses.PLAYER_FROZEN) {
        HandleSocket(room_id, player_id, MovementsEnum.FREEZE, {
          status: GameResponses.FROZEN,
        });
        return HandleResponse.serverResponse(
          res,
          200,
          true,
          GameResponses.FROZEN
        );
      }

      HandleResponse.serverResponse(res, 400, false, GameResponses.GAME_ERROR);
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  discardPower(req: Request<RoomParams, {}, DiscardPower>, res: Response) {
    const { room_id } = req.params;
    const { player_id, powerIdx } = req.body;

    try {
      const result = GameService.discardPower(room_id, player_id, powerIdx);

      if (result === ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          404,
          false,
          ServerResponses.NOT_FOUND
        );

      return HandleResponse.serverResponse(
        res,
        200,
        true,
        GameResponses.POWER_DISCARDED,
        result
      );
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },
};
