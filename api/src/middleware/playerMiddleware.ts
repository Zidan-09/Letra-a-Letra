import { Request, Response, NextFunction } from "express";
import {
  CreatePlayer,
  DeletePlayer,
  GetPlayer,
} from "../utils/requests/playerRequests";
import { HandleResponse } from "../utils/server/handleResponse";
import { PlayerService } from "../services/playerService";
import { ServerResponses } from "../utils/responses/serverResponses";

export const PlayerMiddleware = {
  createPlayer(
    req: Request<{}, {}, CreatePlayer>,
    res: Response,
    next: NextFunction
  ) {
    const { player_id, nickname, avatar } = req.body;

    try {
      if (!player_id || !nickname || !avatar || nickname.length > 10)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.MISSING_DATA
        );

      next();
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  getPlayer(req: Request<GetPlayer>, res: Response, next: NextFunction) {
    const { player_id } = req.params;

    try {
      if (!player_id)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.MISSING_DATA
        );

      next();
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  deletePlayer(req: Request<DeletePlayer>, res: Response, next: NextFunction) {
    const { player_id } = req.params;

    try {
      if (!player_id)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.MISSING_DATA
        );

      const player = PlayerService.getPlayer(player_id);

      if (player === ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          404,
          false,
          ServerResponses.NOT_FOUND
        );

      next();
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },
};
