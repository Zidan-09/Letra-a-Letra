import { Request, Response } from "express";
import { PlayerService } from "../services/playerService";
import { HandleResponse } from "../utils/server/handleResponse";
import {
  CreatePlayer,
  DeletePlayer,
  GetPlayer,
} from "../utils/requests/playerRequests";
import { ServerResponses } from "../utils/responses/serverResponses";
import { PlayerResponses } from "../utils/responses/playerResponses";

export const PlayerController = {
  createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response) {
    const { player_id, nickname, avatar } = req.body;

    try {
      const player = PlayerService.createPlayer(
        player_id,
        nickname,
        false,
        avatar
      );

      return HandleResponse.serverResponse(
        res,
        200,
        true,
        PlayerResponses.PLAYER_CREATED,
        player
      );
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  getPlayer(req: Request<GetPlayer>, res: Response) {
    const { player_id } = req.params;

    try {
      const player = PlayerService.getPlayer(player_id);

      if (player !== ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          200,
          true,
          PlayerResponses.PLAYER_FOUND,
          player
        );

      return HandleResponse.serverResponse(
        res,
        404,
        false,
        ServerResponses.NOT_FOUND
      );
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  getAllPlayers(req: Request, res: Response) {
    try {
      const players = PlayerService.getAll();

      return HandleResponse.serverResponse(
        res,
        200,
        true,
        PlayerResponses.ALL_PLAYERS,
        players
      );
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  deletePlayer(req: Request<DeletePlayer>, res: Response) {
    const { player_id } = req.params;

    try {
      const result = PlayerService.removePlayer(player_id);

      if (result)
        return HandleResponse.serverResponse(
          res,
          200,
          true,
          PlayerResponses.PLAYER_DELETED
        );

      HandleResponse.serverResponse(
        res,
        400,
        false,
        PlayerResponses.PLAYER_DELETED_FAILED
      );
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },
};
