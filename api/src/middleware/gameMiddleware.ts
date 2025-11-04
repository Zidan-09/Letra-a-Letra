import { Request, Response, NextFunction } from "express";
import { HandleResponse } from "../utils/server/handleResponse";
import {
  DiscardPower,
  Movement,
  PassTurn,
  StartGame,
} from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { RoomService } from "../services/roomService";
import { ServerResponses } from "../utils/responses/serverResponses";
import { GameStatus } from "../utils/game/gameStatus";
import { MovementsEnum } from "../utils/game/movementsEnum";
import { Themes } from "../utils/board/themesEnum";
import { RoomParams } from "../utils/requests/roomRequests";
import { GameModes } from "../utils/game/gameModes";
import { PowerRarity } from "../utils/cell/powerRarity";

export const GameMiddleware = {
  startGame(
    req: Request<RoomParams, {}, StartGame>,
    res: Response,
    next: NextFunction
  ) {
    const { room_id } = req.params;
    const { theme, gamemode, allowedPowers } = req.body;

    try {
      if (!room_id || !theme || !gamemode || !allowedPowers)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.MISSING_DATA
        );

      const game = RoomService.getRoom(room_id);

      if (
        game == ServerResponses.NOT_FOUND ||
        game.status === GameStatus.GameRunning
      )
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      if (!Object.values(Themes).includes(theme))
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.INVALID_THEME
        );

      const powers = Object.values(MovementsEnum);

      if (allowedPowers.some((power) => !powers.includes(power)))
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      const gameModes = Object.values(GameModes);

      if (!gameModes.includes(gamemode))
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      next();
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  validateMovement(
    req: Request<RoomParams, {}, Movement>,
    res: Response,
    next: NextFunction
  ) {
    const { room_id } = req.params;
    const { player_id, movement, powerIndex, x, y } = req.body;

    try {
      if (!room_id || !player_id)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.MISSING_DATA
        );

      const game = RoomService.getRoom(room_id);

      if (game === ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.NOT_FOUND
        );

      const players = game.players;

      if (!players?.length)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.NOT_FOUND
        );

      const board = game.board;

      if (game.status !== GameStatus.GameRunning)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      if (x && y) {
        if (!board?.grid[x] || (board.grid[x] && !board.grid[x][y]))
          return HandleResponse.serverResponse(
            res,
            400,
            false,
            GameResponses.GAME_ERROR
          );

        if (
          movement === MovementsEnum.UNBLOCK &&
          !board?.grid[x][y]?.blocked.status
        )
          return HandleResponse.serverResponse(
            res,
            400,
            false,
            GameResponses.CELL_NOT_BLOCKED
          );
      };

      const player = players
        .filter(Boolean)
        .find((p) => p.player_id === player_id);

      if (!player || !board || player.spectator)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      if (game.turn % 2 !== player.turn)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.INVALID_TURN_ACTION
        );

      const movements = Object.values(MovementsEnum);

      if (!movements.includes(movement))
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.INVALID_MOVEMENT
        );

      if (
        (powerIndex !== undefined && 0 > powerIndex) ||
        (powerIndex !== undefined && powerIndex >= 5) ||
        (powerIndex !== undefined &&
          player.powers[powerIndex]?.power !== movement)
      )
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.INVALID_MOVEMENT
        );

      if (
        powerIndex !== undefined &&
        player.powers[powerIndex]?.power &&
        player.powers[powerIndex].power !== movement
      )
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.WITHOUT_POWER
        );

      next();
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  passTurn(
    req: Request<RoomParams, {}, PassTurn>,
    res: Response,
    next: NextFunction
  ) {
    const { room_id } = req.params;
    const { player_id } = req.body;

    try {
      if (!room_id || !player_id)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.MISSING_DATA
        );

      const game = RoomService.getRoom(room_id);

      if (game === ServerResponses.NOT_FOUND)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.NOT_FOUND
        );

      const players = game.players;

      if (!players)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          ServerResponses.NOT_FOUND
        );

      const player = players
        .filter(Boolean)
        .find((p) => p.player_id === player_id);

      if (!player || game.turn % 2 !== player.turn)
        return HandleResponse.serverResponse(
          res,
          400,
          false,
          GameResponses.GAME_ERROR
        );

      next();
    } catch (err) {
      console.error(err);
      HandleResponse.errorResponse(res);
    }
  },

  passBecauseEffect(
    req: Request<RoomParams, {}, PassTurn>,
    res: Response,
    next: NextFunction
  ) {
    const { room_id } = req.params;
    const { player_id } = req.body;

    if (!room_id || !player_id)
      return HandleResponse.serverResponse(
        res,
        400,
        false,
        ServerResponses.MISSING_DATA
      );

    const room = RoomService.getRoom(room_id);

    if (room === ServerResponses.NOT_FOUND)
      return HandleResponse.serverResponse(
        res,
        404,
        false,
        ServerResponses.NOT_FOUND
      );

    const player = room.players
      .filter(Boolean)
      .find((p) => p.player_id === player_id);

    if (!player)
      return HandleResponse.serverResponse(
        res,
        404,
        false,
        ServerResponses.NOT_FOUND
      );

    if (
      (player.freeze.active &&
        player.powers.includes({
          power: MovementsEnum.IMMUNITY,
          rarity: PowerRarity.LEGENDARY,
          type: "effect",
        })) ||
      (player.freeze.active &&
        player.powers.includes({
          power: MovementsEnum.UNFREEZE,
          rarity: PowerRarity.RARE,
          type: "effect",
        }))
    )
      return HandleResponse.serverResponse(
        res,
        400,
        false,
        GameResponses.INVALID_MOVEMENT
      );

    next();
  },

  discardPower(
    req: Request<RoomParams, {}, DiscardPower>,
    res: Response,
    next: NextFunction
  ) {
    const { room_id } = req.params;
    const { player_id, power, powerIdx } = req.body;

    if (!room_id || !player_id || !power || powerIdx === undefined)
      return HandleResponse.serverResponse(
        res,
        400,
        false,
        ServerResponses.MISSING_DATA
      );

    const room = RoomService.getRoom(room_id);

    if (room === ServerResponses.NOT_FOUND)
      return HandleResponse.serverResponse(
        res,
        404,
        false,
        ServerResponses.NOT_FOUND
      );

    const player = room.players.find((p) => p.player_id === player_id);

    if (!player)
      return HandleResponse.serverResponse(
        res,
        404,
        false,
        ServerResponses.NOT_FOUND
      );

    if (
      (powerIdx !== undefined && 0 > powerIdx) ||
      (powerIdx !== undefined && powerIdx >= 5) ||
      player.powers[powerIdx]?.power !== power
    )
      return HandleResponse.serverResponse(
        res,
        400,
        false,
        GameResponses.GAME_ERROR
      );

    if (powerIdx < 0 || powerIdx >= player.powers.length) return;

    next();
  },
};
